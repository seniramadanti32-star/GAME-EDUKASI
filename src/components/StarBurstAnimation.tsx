import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StarBurstAnimationProps {
  triggerKey: number;
}

const STAR_PARTICLES = [
  { id: 1, x: -110, y: -95, scale: 1.25, rotate: -35, delay: 0 },
  { id: 2, x: 115, y: -90, scale: 1.2, rotate: 40, delay: 0.03 },
  { id: 3, x: -140, y: 10, scale: 1.0, rotate: -65, delay: 0.05 },
  { id: 4, x: 145, y: 15, scale: 1.05, rotate: 60, delay: 0.04 },
  { id: 5, x: -70, y: -135, scale: 0.95, rotate: 20, delay: 0.02 },
  { id: 6, x: 75, y: -130, scale: 1.1, rotate: -25, delay: 0.06 },
  { id: 7, x: 0, y: -150, scale: 1.35, rotate: 15, delay: 0.01 },
  { id: 8, x: -95, y: 75, scale: 0.9, rotate: -45, delay: 0.07 },
  { id: 9, x: 95, y: 75, scale: 0.9, rotate: 45, delay: 0.07 },
];

export const Star3DSvg: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="starGold3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M32 4 L40.5 21.2 L59.5 24 L45.7 37.4 L49 56.3 L32 47.4 L15 56.3 L18.3 37.4 L4.5 24 L23.5 21.2 Z"
      fill="url(#starGold3d)"
      stroke="#B45309"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <ellipse cx="26" cy="22" rx="4" ry="7" transform="rotate(-25 26 22)" fill="#FFFFFF" fillOpacity="0.7" />
  </svg>
);

export const StarBurstAnimation: React.FC<StarBurstAnimationProps> = ({ triggerKey }) => {
  return (
    <AnimatePresence mode="popLayout">
      {triggerKey > 0 && (
        <motion.div
          key={triggerKey}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          {/* Floating +10 Poin Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1, 0.95], y: [20, -45, -75, -105] }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-2xl border-2 border-amber-500 bg-amber-400 px-5 py-2.5 text-2xl font-bold text-slate-950 shadow-xl"
          >
            <Star3DSvg className="h-8 w-8" />
            <span className="font-display tracking-tight tabular-nums">+10 Poin!</span>
          </motion.div>

          {/* Bursting 3D Golden Stars */}
          {STAR_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.2, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.x,
                y: p.y,
                scale: [0.2, p.scale, p.scale * 0.85, 0.3],
                rotate: p.rotate,
              }}
              transition={{
                duration: 0.95,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute"
            >
              <Star3DSvg className="h-10 w-10 drop-shadow-md" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
