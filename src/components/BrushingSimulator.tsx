import React, { useState, useEffect } from 'react';
import { BRUSHING_STEPS } from '../data/foods';
import { ToothMascot3D } from './Illustration3D';
import { Star3DSvg } from './StarBurstAnimation';
import { sound } from '../utils/sound';
import { Sparkles, RotateCcw, Play, Pause, CheckCircle2 } from 'lucide-react';

interface SugarSpot {
  id: number;
  label: string;
  x: string;
  y: string;
  cleaned: boolean;
}

const INITIAL_SPOTS: SugarSpot[] = [
  { id: 1, label: 'Sisa Permen', x: '28%', y: '32%', cleaned: false },
  { id: 2, label: 'Noda Cokelat', x: '64%', y: '30%', cleaned: false },
  { id: 3, label: 'Krim Kue', x: '46%', y: '48%', cleaned: false },
  { id: 4, label: 'Asam Soda', x: '32%', y: '62%', cleaned: false },
  { id: 5, label: 'Sirup Es Krim', x: '62%', y: '60%', cleaned: false },
];

export const BrushingSimulator: React.FC<{ onBackToGame: () => void }> = ({ onBackToGame }) => {
  const [spots, setSpots] = useState<SugarSpot[]>(INITIAL_SPOTS);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(120);

  const cleanedCount = spots.filter((s) => s.cleaned).length;
  const allCleaned = cleanedCount === spots.length;

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          sound.playVictory();
          return 0;
        }
        const next = prev - 1;
        // Auto-update step based on 30-second intervals
        const elapsed = 120 - next;
        const stepIdx = Math.min(3, Math.floor(elapsed / 30));
        setActiveStep(stepIdx);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleCleanSpot = (id: number) => {
    setSpots((prev) => {
      const updated = prev.map((spot) => (spot.id === id ? { ...spot, cleaned: true } : spot));
      const newlyCleaned = updated.filter((s) => s.cleaned).length;
      if (newlyCleaned === updated.length) {
        sound.playVictory();
      } else {
        sound.playBrushScrub();
      }
      return updated;
    });
  };

  const resetSpots = () => {
    sound.playClick();
    setSpots(INITIAL_SPOTS.map((s) => ({ ...s, cleaned: false })));
  };

  const toggleTimer = () => {
    sound.playClick();
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    sound.playClick();
    setTimerRunning(false);
    setSecondsLeft(120);
    setActiveStep(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-sky-700">
            Simulasi Interaktif · Kebiasaan Sehat Setiap Hari
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Latihan Sikat Gigi 2 Kali Sehari
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onBackToGame();
          }}
          className="btn-3d-primary inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 py-2.5 font-display text-base font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Kembali ke Permainan Makanan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Interactive Stage: Clean the Tooth */}
        <div className="card-3d flex flex-col justify-between rounded-3xl p-6 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-bold text-slate-900">
                1. Bersihkan Noda Gula di Gigi
              </h3>
              <span className="font-mono text-sm font-semibold text-slate-600 tabular-nums">
                Bersih: {cleanedCount}/{spots.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Ketuk semua noda sisa makanan manis pada karakter gigi di bawah ini untuk menyikatnya hingga berkilau!
            </p>
          </div>

          <div className="relative my-6 flex min-h-[290px] items-center justify-center rounded-2xl bg-sky-50/80 p-6">
            <div className="relative h-60 w-60">
              <ToothMascot3D
                mood={allCleaned ? 'champion' : 'idle'}
                className="h-full w-full drop-shadow-md"
              />

              {/* Interactive Sugar Spots on the Tooth */}
              {spots.map((spot) =>
                !spot.cleaned ? (
                  <button
                    key={spot.id}
                    onClick={() => handleCleanSpot(spot.id)}
                    style={{ left: spot.x, top: spot.y }}
                    title={`Sikat ${spot.label}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-amber-700 bg-amber-400/95 shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="text-xs font-bold text-amber-950">Sikat!</span>
                  </button>
                ) : (
                  <div
                    key={spot.id}
                    style={{ left: spot.x, top: spot.y }}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-bounce"
                  >
                    <Star3DSvg className="h-7 w-7" />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
            <div className="text-sm font-semibold text-slate-700">
              {allCleaned ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Hebat! Gigi sudah bersih berkilau dari sisa gula!
                </span>
              ) : (
                <span>Masih ada {spots.length - cleanedCount} noda manis yang menempel.</span>
              )}
            </div>
            <button
              onClick={resetSpots}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Ulangi Sikat Noda
            </button>
          </div>
        </div>

        {/* Right Interactive Timer & 4 Steps */}
        <div className="card-3d flex flex-col justify-between rounded-3xl p-6 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  2. Pengatur Waktu Sikat Gigi (2 Menit)
                </h3>
                <p className="mt-0.5 text-sm text-slate-600">
                  Pagi sesudah sarapan · Malam sebelum tidur
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-sky-700 tabular-nums">
                  {formatTime(secondsLeft)}
                </span>
                <button
                  onClick={toggleTimer}
                  className="btn-3d-emerald inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {timerRunning ? 'Jeda' : 'Mulai'}
                </button>
                <button
                  onClick={resetTimer}
                  aria-label="Atur ulang waktu"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {BRUSHING_STEPS.map((item, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <button
                    key={item.step}
                    onClick={() => {
                      sound.playClick();
                      setActiveStep(idx);
                    }}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-colors cursor-pointer ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50/70'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-bold text-slate-900">
                        0{item.step}. {item.title}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Ingat: Menyikat gigi 2 kali sehari dan minum air putih menjaga senyummu tetap sehat!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
