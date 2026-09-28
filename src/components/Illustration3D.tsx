import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'oops' | 'champion';

interface ToothMascotProps {
  mood?: MascotMood;
  className?: string;
}

export const ToothMascot3D: React.FC<ToothMascotProps> = ({
  mood = 'idle',
  className = 'w-32 h-32',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Karakter Gigi Lucu"
    >
      <defs>
        {/* 3D Enamel Body Gradient */}
        <radialGradient id="toothBodyGrad" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F0F9FF" />
          <stop offset="85%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </radialGradient>

        {/* Bottom 3D Rim Shadow */}
        <linearGradient id="toothShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.35" />
        </linearGradient>

        {/* Cheek Blush */}
        <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
        </radialGradient>

        {/* Gold Crown / Star Gradient */}
        <linearGradient id="gold3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Toothbrush Handle Gradient */}
        <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Soft Ground Cast Shadow */}
      <ellipse cx="100" cy="184" rx="52" ry="10" fill="#0F172A" fillOpacity="0.12" />

      {/* Champion Cape (if champion) */}
      {mood === 'champion' && (
        <path
          d="M55 85 C30 115, 28 155, 42 172 C75 165, 125 165, 158 172 C172 155, 170 115, 145 85 Z"
          fill="#EF4444"
          stroke="#B91C1C"
          strokeWidth="3"
        />
      )}

      {/* Left Arm */}
      {mood === 'happy' || mood === 'champion' ? (
        <path
          d="M48 102 C26 88, 22 65, 34 54"
          stroke="#38BDF8"
          strokeWidth="10"
          strokeLinecap="round"
        />
      ) : mood === 'oops' ? (
        <path
          d="M48 106 C28 112, 26 95, 38 86"
          stroke="#38BDF8"
          strokeWidth="10"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M48 105 C28 115, 24 128, 32 136"
          stroke="#38BDF8"
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}

      {/* Right Arm */}
      {mood === 'happy' || mood === 'champion' ? (
        <path
          d="M152 102 C174 88, 178 65, 166 54"
          stroke="#38BDF8"
          strokeWidth="10"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M152 104 C172 92, 178 74, 168 64"
          stroke="#38BDF8"
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}

      {/* Main 3D Tooth Silhouette */}
      <path
        d="M64 42 C44 42, 38 68, 44 98 C48 118, 54 138, 58 162 C61 174, 73 176, 79 163 C85 148, 91 138, 100 138 C109 138, 115 148, 121 163 C127 176, 139 174, 142 162 C146 138, 152 118, 156 98 C162 68, 156 42, 136 42 C121 42, 111 50, 100 50 C89 50, 79 42, 64 42 Z"
        fill="url(#toothBodyGrad)"
        stroke="#0284C7"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Inner 3D Volume Shading */}
      <path
        d="M48 105 C53 130, 56 145, 59 162 C62 172, 72 173, 78 160 C84 146, 91 136, 100 136 C109 136, 116 146, 122 160 C128 173, 138 172, 141 162 C144 145, 147 130, 152 105 C140 124, 60 124, 48 105 Z"
        fill="url(#toothShadowGrad)"
      />

      {/* Glossy 3D Specular Highlights on Enamel Crown */}
      <ellipse
        cx="65"
        cy="66"
        rx="14"
        ry="22"
        transform="rotate(-18 65 66)"
        fill="#FFFFFF"
        fillOpacity="0.85"
      />
      <circle cx="58" cy="94" r="5" fill="#FFFFFF" fillOpacity="0.8" />
      <ellipse
        cx="134"
        cy="62"
        rx="8"
        ry="13"
        transform="rotate(15 134 62)"
        fill="#FFFFFF"
        fillOpacity="0.6"
      />

      {/* Rosy Cheeks */}
      <circle cx="66" cy="105" r="12" fill="url(#cheekGrad)" />
      <circle cx="134" cy="105" r="12" fill="url(#cheekGrad)" />

      {/* Eyes based on mood */}
      {mood === 'happy' || mood === 'champion' ? (
        <>
          {/* Happy arched eyes */}
          <path
            d="M70 88 C74 78, 84 78, 88 88"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M112 88 C116 78, 126 78, 130 88"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </>
      ) : mood === 'oops' ? (
        <>
          {/* Concerned / encouraging eyes */}
          <circle cx="78" cy="88" r="7.5" fill="#0F172A" />
          <circle cx="76" cy="85" r="2.8" fill="#FFFFFF" />
          <circle cx="122" cy="88" r="7.5" fill="#0F172A" />
          <circle cx="120" cy="85" r="2.8" fill="#FFFFFF" />
          {/* Gentle eyebrows */}
          <path d="M68 75 L85 78" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M132 75 L115 78" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Big cute glossy cartoon eyes */}
          <circle cx="78" cy="88" r="8.5" fill="#0F172A" />
          <circle cx="75.5" cy="85" r="3.2" fill="#FFFFFF" />
          <circle cx="81" cy="91" r="1.5" fill="#FFFFFF" />

          <circle cx="122" cy="88" r="8.5" fill="#0F172A" />
          <circle cx="119.5" cy="85" r="3.2" fill="#FFFFFF" />
          <circle cx="125" cy="91" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth based on mood */}
      {mood === 'oops' ? (
        <path
          d="M90 112 C95 106, 105 106, 110 112"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M82 102 C86 120, 114 120, 118 102 Z"
            fill="#E11D48"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M89 111 C94 106, 106 106, 111 111 C106 116, 94 116, 89 111 Z"
            fill="#FDA4AF"
          />
        </g>
      )}

      {/* Cute 3D Toothbrush held in right hand */}
      <g transform="translate(148, 28) rotate(22)">
        <rect
          x="12"
          y="10"
          width="9"
          height="58"
          rx="4.5"
          fill="url(#brushGrad)"
          stroke="#065F46"
          strokeWidth="2"
        />
        {/* Bristles */}
        <rect
          x="3"
          y="12"
          width="10"
          height="18"
          rx="3"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />
        {/* Toothpaste dollop */}
        <path
          d="M2 16 C2 10, 12 10, 12 16 C12 21, 2 21, 2 16 Z"
          fill="#38BDF8"
        />
      </g>

      {/* Golden Crown for Champion */}
      {mood === 'champion' && (
        <path
          d="M72 42 L66 16 L86 28 L100 10 L114 28 L134 16 L128 42 Z"
          fill="url(#gold3D)"
          stroke="#B45309"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}

      {/* Sparkle Stars around Happy / Idle / Champion Tooth */}
      {mood !== 'oops' && (
        <>
          <path
            d="M32 34 L35 42 L43 45 L35 48 L32 56 L29 48 L21 45 L29 42 Z"
            fill="url(#gold3D)"
          />
          <path
            d="M168 122 L170 128 L176 130 L170 132 L168 138 L166 132 L160 130 L166 128 Z"
            fill="url(#gold3D)"
          />
        </>
      )}
    </svg>
  );
};

interface FoodIllustrationProps {
  foodId: string;
  className?: string;
}

export const FoodIllustration3D: React.FC<FoodIllustrationProps> = ({
  foodId,
  className = 'w-24 h-24',
}) => {
  switch (foodId) {
    case 'apel':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <radialGradient id="appleGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF8FA3" />
              <stop offset="40%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="32" ry="7" fill="#0F172A" fillOpacity="0.12" />
          {/* Stem */}
          <path d="M60 32 C60 20, 65 14, 70 12" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M62 24 C74 14, 92 18, 88 30 C82 38, 68 34, 62 24 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="2" />
          {/* Apple 3D Body */}
          <path
            d="M60 32 C45 26, 22 36, 22 62 C22 88, 42 104, 55 102 C58 101, 62 101, 65 102 C78 104, 98 88, 98 62 C98 36, 75 26, 60 32 Z"
            fill="url(#appleGrad)"
            stroke="#991B1B"
            strokeWidth="3"
          />
          {/* 3D Gloss Highlight */}
          <ellipse cx="42" cy="52" rx="9" ry="16" transform="rotate(-20 42 52)" fill="#FFFFFF" fillOpacity="0.65" />
          <circle cx="36" cy="72" r="3.5" fill="#FFFFFF" fillOpacity="0.55" />
        </svg>
      );

    case 'wortel':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="carrotGrad" x1="20%" y1="15%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="40%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="28" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Carrot Leaves */}
          <path
            d="M78 38 C84 18, 98 14, 96 28 C106 20, 112 32, 98 40 C106 44, 98 54, 82 44 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 3D Carrot Cone */}
          <path
            d="M84 36 C92 44, 88 58, 74 70 L32 100 C24 105, 18 99, 23 91 L53 49 C64 34, 76 28, 84 36 Z"
            fill="url(#carrotGrad)"
            stroke="#9A3412"
            strokeWidth="3"
          />
          {/* Specular Strip */}
          <path d="M72 44 L36 88" stroke="#FFEDD5" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.65" />
          {/* Ridges */}
          <path d="M62 46 C66 50, 68 53, 66 56" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 62 C55 66, 57 70, 54 73" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M39 78 C43 81, 45 84, 43 87" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'keju':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="cheeseTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
            <linearGradient id="cheeseSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="38" ry="7" fill="#0F172A" fillOpacity="0.12" />
          {/* Top Wedge Surface */}
          <path
            d="M20 56 L72 24 C90 30, 102 44, 100 56 L20 56 Z"
            fill="url(#cheeseTop)"
            stroke="#CA8A04"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Front 3D Block Face */}
          <path
            d="M20 56 L100 56 L100 88 C100 92, 96 94, 92 94 L24 94 C21 94, 20 91, 20 88 Z"
            fill="url(#cheeseSide)"
            stroke="#CA8A04"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 3D Cheese Holes */}
          <circle cx="44" cy="74" r="8" fill="#CA8A04" fillOpacity="0.45" />
          <circle cx="76" cy="70" r="6" fill="#CA8A04" fillOpacity="0.45" />
          <circle cx="62" cy="83" r="4.5" fill="#CA8A04" fillOpacity="0.45" />
          <ellipse cx="66" cy="44" rx="7" ry="4" fill="#CA8A04" fillOpacity="0.35" />
          {/* Highlight */}
          <path d="M26 61 L92 61" stroke="#FEF9C3" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'susu':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="milkBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="28" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Carton / Bottle Base */}
          <path
            d="M36 44 L84 44 L84 96 C84 100, 80 102, 76 102 L44 102 C40 102, 36 100, 36 96 Z"
            fill="url(#milkBody)"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Carton Gable Roof */}
          <path
            d="M36 44 L48 24 L72 24 L84 44 Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Cap */}
          <rect x="46" y="16" width="28" height="8" rx="3" fill="#0284C7" />
          {/* Blue Banner */}
          <rect x="38" y="58" width="44" height="24" fill="#0EA5E9" />
          {/* Drop icon on milk */}
          <path d="M60 63 C60 63, 67 71, 67 75 C67 79, 64 81, 60 81 C56 81, 53 79, 53 75 C53 71, 60 63, 60 63 Z" fill="#FFFFFF" />
          {/* Gloss */}
          <path d="M43 50 L43 94" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'air-putih':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="28" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Outer Glass */}
          <path
            d="M32 24 L88 24 L80 96 C79 100, 75 102, 70 102 L50 102 C45 102, 41 100, 40 96 Z"
            fill="#F0F9FF"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Water Level */}
          <path
            d="M35 42 C48 38, 72 46, 85 42 L79 94 C78 98, 75 99, 70 99 L50 99 C45 99, 42 98, 41 94 Z"
            fill="url(#waterGrad)"
          />
          {/* Water Surface Ripple */}
          <ellipse cx="60" cy="42" rx="25" ry="4" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Glass Specular Reflection */}
          <path d="M40 32 L45 90" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeOpacity="0.85" />
          <circle cx="56" cy="74" r="3" fill="#FFFFFF" fillOpacity="0.7" />
          <circle cx="66" cy="62" r="4" fill="#FFFFFF" fillOpacity="0.7" />
        </svg>
      );

    case 'permen':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <radialGradient id="candyGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="55%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="30" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Left Wrapper Twist */}
          <path
            d="M36 52 L14 34 L18 58 L12 76 L36 66 Z"
            fill="#F472B6"
            stroke="#9D174D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Wrapper Twist */}
          <path
            d="M84 52 L106 34 L102 58 L108 76 L84 66 Z"
            fill="#F472B6"
            stroke="#9D174D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Center 3D Candy Sphere */}
          <circle cx="60" cy="60" r="28" fill="url(#candyGrad)" stroke="#9D174D" strokeWidth="3" />
          {/* Candy Stripes */}
          <path d="M45 37 C58 48, 58 72, 45 83" stroke="#FEF08A" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M60 33 C73 48, 73 72, 60 87" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M75 37 C84 48, 84 72, 75 83" stroke="#FEF08A" strokeWidth="4.5" strokeLinecap="round" />
          {/* Gloss */}
          <ellipse cx="48" cy="46" rx="7" ry="4" transform="rotate(-30 48 46)" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      );

    case 'cokelat':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="chocoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="28" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Chocolate Bar Base */}
          <rect
            x="32"
            y="18"
            width="56"
            height="82"
            rx="6"
            fill="url(#chocoGrad)"
            stroke="#451A03"
            strokeWidth="3"
          />
          {/* 3D Chocolate Squares */}
          <rect x="38" y="24" width="20" height="18" rx="2" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />
          <rect x="62" y="24" width="20" height="18" rx="2" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />
          <rect x="38" y="46" width="20" height="18" rx="2" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />
          <rect x="62" y="46" width="20" height="18" rx="2" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />
          {/* Golden Foil & Red Wrapper */}
          <path d="M30 64 L90 58 L90 72 L30 76 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <rect
            x="30"
            y="68"
            width="60"
            height="34"
            rx="4"
            fill="#E11D48"
            stroke="#9F1239"
            strokeWidth="3"
          />
          {/* Highlight */}
          <path d="M41 27 L54 27" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M65 27 L78 27" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        </svg>
      );

    case 'es-krim':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <radialGradient id="scoopGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="60%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="22" ry="5" fill="#0F172A" fillOpacity="0.12" />
          {/* Waffle Cone */}
          <path
            d="M38 56 L82 56 L60 104 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M44 64 L74 64" stroke="#B45309" strokeWidth="2" />
          <path d="M48 76 L70 76" stroke="#B45309" strokeWidth="2" />
          {/* Ice Cream Scoop */}
          <path
            d="M34 52 C30 32, 44 20, 60 20 C76 20, 90 32, 86 52 C90 56, 86 64, 78 62 C72 60, 66 64, 60 62 C54 64, 48 60, 42 62 C34 64, 30 56, 34 52 Z"
            fill="url(#scoopGrad)"
            stroke="#BE185D"
            strokeWidth="3"
          />
          {/* Cherry on Top */}
          <circle cx="60" cy="16" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <path d="M60 10 C64 4, 72 4, 76 8" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Gloss */}
          <ellipse cx="48" cy="36" rx="6" ry="9" transform="rotate(-20 48 36)" fill="#FFFFFF" fillOpacity="0.7" />
        </svg>
      );

    case 'minuman-bersoda':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="sodaCan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="45%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="28" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Straw */}
          <path d="M64 32 L72 12 L86 12" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Soda Can Body */}
          <rect
            x="36"
            y="30"
            width="48"
            height="72"
            rx="10"
            fill="url(#sodaCan)"
            stroke="#881337"
            strokeWidth="3"
          />
          {/* Metallic Rim */}
          <rect x="38" y="26" width="44" height="7" rx="3.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <rect x="38" y="98" width="44" height="6" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          {/* White Dynamic Wave Stripe */}
          <path d="M36 62 C50 52, 70 72, 84 62 L84 74 C70 84, 50 64, 36 74 Z" fill="#FFFFFF" />
          {/* Fizzy Bubbles */}
          <circle cx="52" cy="18" r="3.5" fill="#FDA4AF" />
          <circle cx="44" cy="22" r="2.5" fill="#FDA4AF" />
          {/* Highlight */}
          <path d="M43 38 L43 90" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.55" />
        </svg>
      );

    case 'kue-manis':
    default:
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <defs>
            <linearGradient id="frostingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="30" ry="6" fill="#0F172A" fillOpacity="0.12" />
          {/* Cupcake Liner */}
          <path
            d="M34 62 L86 62 L78 98 C77 101, 73 102, 68 102 L52 102 C47 102, 43 101, 42 98 Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M46 62 L50 100" stroke="#0284C7" strokeWidth="2" />
          <path d="M60 62 L60 102" stroke="#0284C7" strokeWidth="2" />
          <path d="M74 62 L70 100" stroke="#0284C7" strokeWidth="2" />
          {/* 3D Swirl Frosting */}
          <path
            d="M28 58 C24 46, 36 38, 42 38 C42 26, 54 20, 60 20 C66 20, 78 26, 78 38 C84 38, 96 46, 92 58 C90 64, 82 66, 60 66 C38 66, 30 64, 28 58 Z"
            fill="url(#frostingGrad)"
            stroke="#9D174D"
            strokeWidth="3"
          />
          {/* Sprinkles */}
          <rect x="46" y="42" width="8" height="3.5" rx="1.5" transform="rotate(-20 46 42)" fill="#FEF08A" />
          <rect x="66" y="46" width="8" height="3.5" rx="1.5" transform="rotate(25 66 46)" fill="#4ADE80" />
          <rect x="55" y="32" width="8" height="3.5" rx="1.5" transform="rotate(10 55 32)" fill="#38BDF8" />
          <rect x="40" y="54" width="8" height="3.5" rx="1.5" transform="rotate(15 40 54)" fill="#FFFFFF" />
          <rect x="72" y="54" width="8" height="3.5" rx="1.5" transform="rotate(-15 72 54)" fill="#FEF08A" />
        </svg>
      );
  }
};
