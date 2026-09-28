/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  INITIAL_FOODS,
  GAME_MESSAGES,
  FoodItem,
  FoodCategory,
} from './data/foods';
import {
  ToothMascot3D,
  FoodIllustration3D,
  MascotMood,
} from './components/Illustration3D';
import { StarBurstAnimation, Star3DSvg } from './components/StarBurstAnimation';
import { FoodEncyclopedia } from './components/FoodEncyclopedia';
import { BrushingSimulator } from './components/BrushingSimulator';
import { sound } from './utils/sound';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Hand,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Trophy,
  ArrowRight,
} from 'lucide-react';

type ActiveTab = 'game' | 'encyclopedia' | 'brushing' | 'howto';

interface FeedbackState {
  type: 'idle' | 'correct' | 'wrong';
  headline: string;
  detail: string;
  foodName?: string;
}

interface PointerDragState {
  food: FoodItem;
  clientX: number;
  clientY: number;
  hoveredZone: FoodCategory | null;
}

export default function App() {
  // Navigation & Audio State
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Game State
  const [unsortedFoods, setUnsortedFoods] = useState<FoodItem[]>(() => INITIAL_FOODS);
  const [goodBasket, setGoodBasket] = useState<FoodItem[]>([]);
  const [limitBasket, setLimitBasket] = useState<FoodItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(INITIAL_FOODS[0].id);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);
  const [starTrigger, setStarTrigger] = useState<number>(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

  const [feedback, setFeedback] = useState<FeedbackState>({
    type: 'idle',
    headline: 'Ayo pilih dan seret makanan ke kotak yang tepat!',
    detail:
      'Seret kartu makanan ke kategori 🦷 BAIK UNTUK GIGI atau 🍭 PERLU DIBATASI.',
  });

  // Drag-and-Drop Refs & State
  const goodZoneRef = useRef<HTMLDivElement | null>(null);
  const limitZoneRef = useRef<HTMLDivElement | null>(null);
  const [htmlDragHoveredZone, setHtmlDragHoveredZone] = useState<FoodCategory | null>(null);
  const [pointerDrag, setPointerDrag] = useState<PointerDragState | null>(null);
  const pointerStartPos = useRef<{ x: number; y: number; food: FoodItem } | null>(null);

  const isGameComplete = unsortedFoods.length === 0;

  // Keep selectedFoodId valid when unsortedFoods changes
  useEffect(() => {
    if (unsortedFoods.length > 0) {
      const exists = unsortedFoods.some((f) => f.id === selectedFoodId);
      if (!exists) {
        setSelectedFoodId(unsortedFoods[0].id);
      }
    } else {
      setMascotMood('champion');
    }
  }, [unsortedFoods, selectedFoodId]);

  const selectedFood =
    unsortedFoods.find((f) => f.id === selectedFoodId) || unsortedFoods[0] || null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) {
      sound.playClick();
    }
  };

  // Shuffle helper for replay
  const handleRestartGame = (shuffleItems: boolean = true) => {
    sound.playClick();
    const list = [...INITIAL_FOODS];
    if (shuffleItems) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    setUnsortedFoods(list);
    setGoodBasket([]);
    setLimitBasket([]);
    setScore(0);
    setAttempts(0);
    setSelectedFoodId(list[0].id);
    setMascotMood('idle');
    setWrongShakeId(null);
    setFeedback({
      type: 'idle',
      headline: 'Permainan baru dimulai! Seret makanan ke kotak yang sesuai.',
      detail:
        'Pilih makanan bergizi untuk memperkuat gigi dan batasi makanan yang tinggi gula.',
    });
    setActiveTab('game');
  };

  // Core evaluation logic when a food item is placed into a target category
  const evaluateDrop = useCallback(
    (food: FoodItem, targetCategory: FoodCategory) => {
      // Check if food is still in unsortedFoods
      setUnsortedFoods((currentUnsorted) => {
        const stillUnsorted = currentUnsorted.some((f) => f.id === food.id);
        if (!stillUnsorted) return currentUnsorted;

        setAttempts((prev) => prev + 1);

        if (food.category === targetCategory) {
          // CORRECT ANSWER!
          // +10 points, star burst animation, exact message
          const remaining = currentUnsorted.filter((f) => f.id !== food.id);
          setScore((prevScore) => prevScore + 10);
          setStarTrigger((prev) => prev + 1);

          if (targetCategory === 'good') {
            setGoodBasket((prev) => [...prev, food]);
          } else {
            setLimitBasket((prev) => [...prev, food]);
          }

          setFeedback({
            type: 'correct',
            headline: GAME_MESSAGES.CORRECT,
            detail: `${food.name}: ${food.dentalFact}`,
            foodName: food.name,
          });

          if (remaining.length === 0) {
            setMascotMood('champion');
            sound.playVictory();
          } else {
            setMascotMood('happy');
            sound.playCorrect();
          }

          return remaining;
        } else {
          // WRONG ANSWER!
          // Does NOT reduce points ("Tidak mengurangi poin.")
          // Exact message: "Coba lagi! Ingat, makanan manis sebaiknya tidak terlalu sering dikonsumsi."
          sound.playWrong();
          setMascotMood('oops');
          setWrongShakeId(food.id);
          window.setTimeout(() => setWrongShakeId(null), 650);

          setFeedback({
            type: 'wrong',
            headline: GAME_MESSAGES.WRONG,
            detail: `${food.name} termasuk kategori "${food.categoryLabel}". Yuk, masukkan ke kotak yang benar!`,
            foodName: food.name,
          });

          return currentUnsorted;
        }
      });
    },
    []
  );

  // Detect which drop zone is under clientX, clientY
  const getZoneAtPoint = (clientX: number, clientY: number): FoodCategory | null => {
    if (goodZoneRef.current) {
      const rect = goodZoneRef.current.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return 'good';
      }
    }
    if (limitZoneRef.current) {
      const rect = limitZoneRef.current.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return 'limit';
      }
    }
    return null;
  };

  // Global Pointer Move / Up listeners for smooth touch & mouse dragging
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!pointerStartPos.current) return;
      const dx = e.clientX - pointerStartPos.current.x;
      const dy = e.clientY - pointerStartPos.current.y;
      const dist = Math.hypot(dx, dy);

      // Start visual drag once pointer moves > 6px
      if (dist > 6 || pointerDrag) {
        const hoveredZone = getZoneAtPoint(e.clientX, e.clientY);
        setPointerDrag({
          food: pointerStartPos.current.food,
          clientX: e.clientX,
          clientY: e.clientY,
          hoveredZone,
        });
      }
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (!pointerStartPos.current) return;
      const draggedFood = pointerStartPos.current.food;
      pointerStartPos.current = null;

      if (pointerDrag) {
        const dropZone = getZoneAtPoint(e.clientX, e.clientY);
        setPointerDrag(null);
        if (dropZone) {
          evaluateDrop(draggedFood, dropZone);
        }
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [pointerDrag, evaluateDrop]);

  // HTML5 Drag Handlers (for standard desktop drag & automated test compatibility)
  const handleHtmlDragStart = (e: React.DragEvent, food: FoodItem) => {
    pointerStartPos.current = null;
    setPointerDrag(null);
    sound.playPickup();
    setSelectedFoodId(food.id);
    e.dataTransfer.setData('text/plain', food.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHtmlDrop = (e: React.DragEvent, targetCategory: FoodCategory) => {
    e.preventDefault();
    pointerStartPos.current = null;
    setPointerDrag(null);
    setHtmlDragHoveredZone(null);
    const foodId = e.dataTransfer.getData('text/plain') || selectedFoodId;
    const food = unsortedFoods.find((f) => f.id === foodId);
    if (food) {
      evaluateDrop(food, targetCategory);
    }
  };

  const activeHoveredZone = pointerDrag?.hoveredZone || htmlDragHoveredZone;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Star Burst Animation Overlay on Correct Answer */}
      <StarBurstAnimation triggerKey={starTrigger} />

      {/* Floating 3D Card Ghost during Pointer / Touch Drag */}
      {pointerDrag && (
        <div
          style={{
            transform: `translate3d(${pointerDrag.clientX - 72}px, ${pointerDrag.clientY - 72}px, 0) rotate(-4deg) scale(1.06)`,
          }}
          className="pointer-events-none fixed left-0 top-0 z-50 flex h-36 w-36 flex-col items-center justify-center rounded-2xl border-2 border-sky-500 bg-white p-3 shadow-2xl"
        >
          <FoodIllustration3D foodId={pointerDrag.food.id} className="h-20 w-20" />
          <span className="mt-1 font-display text-base font-bold text-slate-900">
            {pointerDrag.food.name}
          </span>
        </div>
      )}

      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#permainan"
          onClick={(e) => {
            e.preventDefault();
            sound.playClick();
            setActiveTab('game');
          }}
          className="font-display text-lg font-bold tracking-tight text-sky-700 sm:text-xl whitespace-nowrap shrink-0"
        >
          PILIH MAKANAN UNTUK GIGIMU
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('game');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'game'
                ? 'text-sky-700 underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            Permainan
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('encyclopedia');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'encyclopedia'
                ? 'text-sky-700 underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            Kamus Makanan
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('brushing');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'brushing'
                ? 'text-sky-700 underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            Sikat Gigi
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('howto');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'howto'
                ? 'text-sky-700 underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            Cara Bermain
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-sky-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {soundEnabled ? 'Suara Aktif' : 'Suara Bisu'}
            </span>
          </button>

          <button
            onClick={() => handleRestartGame(true)}
            className="btn-3d-primary inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold text-white sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Mulai Ulang</span>
          </button>
        </div>
      </header>

      {/* Mobile Mode Switcher (Clean Segmented Control for Narrow Viewports) */}
      <div className="flex md:hidden items-center justify-center gap-1 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('game');
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'game' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          Permainan
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('encyclopedia');
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'encyclopedia' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          Kamus
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('brushing');
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'brushing' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          Sikat Gigi
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('howto');
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'howto' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          Panduan
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'encyclopedia' && (
          <FoodEncyclopedia onBackToGame={() => setActiveTab('game')} />
        )}

        {activeTab === 'brushing' && (
          <BrushingSimulator onBackToGame={() => setActiveTab('game')} />
        )}

        {activeTab === 'howto' && (
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <div className="card-3d rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ToothMascot3D mood="happy" className="h-32 w-32 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-sky-700">
                    Panduan Anak Usia 6–12 Tahun · Tanpa Iklan & Aman
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                    Cara Bermain “Pilih Makanan Untuk Gigimu”
                  </h1>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">
                    Bantu karakter Gigi Lucu memilih makanan yang membuat gigi kuat dan memisahkan makanan manis yang perlu dibatasi!
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="font-display text-lg font-bold text-sky-700">
                    01. Pilih atau Seret Makanan
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Terdapat 10 makanan (Apel, Wortel, Keju, Susu, Air putih, Permen, Cokelat, Es krim, Minuman bersoda, dan Kue manis). Seret kartu makanan menggunakan jari atau mouse!
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="font-display text-lg font-bold text-emerald-700">
                    02. Masukkan ke Kategori Tepat
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Lepaskan makanan sehat ke kotak <strong>🦷 BAIK UNTUK GIGI</strong> dan makanan manis ke kotak <strong>🍭 PERLU DIBATASI</strong>. Kamu juga bisa menekan tombol besar yang tersedia.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="font-display text-lg font-bold text-amber-700">
                    03. Kumpulkan Bintang & Poin
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Setiap jawaban benar mendapat <strong>+10 poin</strong> dan animasi bintang! Jawaban salah tidak mengurangi poin sehingga kamu bisa terus belajar dengan gembira.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('game');
                  }}
                  className="btn-3d-primary inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 font-display text-base font-bold text-white cursor-pointer"
                >
                  <span>Mulai Bermain Sekarang</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            {/* Top Game HUD Banner: Mascot + Live Feedback + Score Counter */}
            <section
              aria-live="polite"
              className="mb-6 rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                {/* Left: 3D Cute Tooth Mascot + Interactive Speech Feedback */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left text-center">
                  <div className="relative shrink-0">
                    <ToothMascot3D
                      mood={mascotMood}
                      className="h-24 w-24 sm:h-28 sm:w-28 animate-float-slow"
                    />
                  </div>

                  <div className="max-w-2xl">
                    {/* Unboxed Metadata Status Row */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-500">
                      <span>Game Edukasi Anak 6–12 Tahun</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        Tersisa {unsortedFoods.length} dari {INITIAL_FOODS.length} Makanan
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                         Terkumpul {goodBasket.length + limitBasket.length}/10
                      </span>
                    </div>

                    {/* Dynamic Feedback Message Banner */}
                    <div
                      className={`mt-2 flex items-start gap-2.5 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                        feedback.type === 'correct'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                          : feedback.type === 'wrong'
                          ? 'border-amber-500 bg-amber-50 text-amber-950'
                          : 'border-sky-200 bg-sky-50/70 text-slate-900'
                      }`}
                    >
                      {feedback.type === 'correct' ? (
                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                      ) : feedback.type === 'wrong' ? (
                        <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                      ) : (
                        <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-sky-600" />
                      )}
                      <div>
                        <p className="font-display text-base font-bold sm:text-lg">
                          {feedback.headline}
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-700">
                          {feedback.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Progress HUD */}
                <div className="flex items-center justify-center gap-5 border-t border-slate-100 pt-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 shrink-0">
                  <div className="flex items-center gap-3">
                    <Star3DSvg className="h-11 w-11 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-500">
                        SKOR SAAT INI
                      </div>
                      <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums sm:text-4xl">
                        {score}
                        <span className="ml-1 font-sans text-sm font-semibold text-slate-500">
                          poin
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* VICTORY / COMPLETION SCREEN WHEN ALL 10 FOODS ARE SORTED */}
            {isGameComplete ? (
              <section className="card-3d mx-auto max-w-4xl rounded-3xl p-6 text-center sm:p-10">
                <div className="mx-auto flex justify-center">
                  <ToothMascot3D mood="champion" className="h-40 w-40 animate-float-slow" />
                </div>

                <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-amber-600">
                  <Trophy className="h-5 w-5" />
                  <span>SEMUA 10 MAKANAN BERHASIL DIPILIH!</span>
                </div>

                <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                  Skor Akhir Kamu: <span className="text-sky-600 tabular-nums">{score} Poin</span>
                </h1>

                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="tabular-nums">10 Makanan Selesai</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Total Percobaan: {attempts}</span>
                  <span aria-hidden="true">·</span>
                  <span>Bintang Terkumpul: 10 ★</span>
                </div>

                {/* Exact Required Final Educational Message */}
                <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 sm:p-6">
                  <p className="font-display text-lg font-bold leading-relaxed text-emerald-950 sm:text-xl">
                    “{GAME_MESSAGES.FINAL_EDUCATION}”
                  </p>
                </div>

                {/* Summary of Sorted Categories */}
                <div className="mt-8 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
                  {/* Good Foods Summary */}
                  <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
                    <h2 className="font-display text-lg font-bold text-emerald-900">
                      🦷 BAIK UNTUK GIGI ({goodBasket.length})
                    </h2>
                    <p className="mt-0.5 text-xs text-emerald-800">
                      Kaya kalsium, serat, vitamin, dan air pembilas alami:
                    </p>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {goodBasket.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center rounded-xl bg-white p-2 text-center shadow-xs"
                        >
                          <FoodIllustration3D foodId={item.id} className="h-10 w-10" />
                          <span className="mt-1 text-[11px] font-bold text-slate-800">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limit Foods Summary */}
                  <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5">
                    <h2 className="font-display text-lg font-bold text-amber-900">
                      🍭 PERLU DIBATASI ({limitBasket.length})
                    </h2>
                    <p className="mt-0.5 text-xs text-amber-800">
                      Mengandung gula tinggi atau asam yang perlu dibatasi:
                    </p>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {limitBasket.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center rounded-xl bg-white p-2 text-center shadow-xs"
                        >
                          <FoodIllustration3D foodId={item.id} className="h-10 w-10" />
                          <span className="mt-1 text-[11px] font-bold text-slate-800">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Large Kid-Friendly Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => handleRestartGame(true)}
                    className="btn-3d-primary inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl px-8 py-3.5 font-display text-lg font-bold text-white cursor-pointer"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Main Lagi</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('brushing');
                    }}
                    className="btn-3d-emerald inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl px-7 py-3.5 font-display text-lg font-bold text-white cursor-pointer"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Latihan Sikat Gigi 2x Sehari</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('encyclopedia');
                    }}
                    className="inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-6 py-3.5 font-display text-base font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <HelpCircle className="h-5 w-5 text-sky-600" />
                    <span>Pelajari Kamus Makanan</span>
                  </button>
                </div>
              </section>
            ) : (
              /* ACTIVE DRAG-AND-DROP GAMEPLAY STAGE */
              <div className="space-y-8">
                {/* TWO LARGE DROP ZONES: 🦷 BAIK UNTUK GIGI & 🍭 PERLU DIBATASI */}
                <section
                  aria-label="Kategori Pilihan Makanan"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {/* Category 1: 🦷 BAIK UNTUK GIGI */}
                  <div
                    ref={goodZoneRef}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (htmlDragHoveredZone !== 'good') {
                        setHtmlDragHoveredZone('good');
                      }
                    }}
                    onDragLeave={() => setHtmlDragHoveredZone(null)}
                    onDrop={(e) => handleHtmlDrop(e, 'good')}
                    onClick={() => {
                      if (selectedFood) {
                        evaluateDrop(selectedFood, 'good');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && selectedFood) {
                        e.preventDefault();
                        evaluateDrop(selectedFood, 'good');
                      }
                    }}
                    aria-label="Kotak Kategori Baik Untuk Gigi"
                    className={`group relative flex min-h-[250px] flex-col justify-between rounded-3xl border-4 p-5 transition-all cursor-pointer sm:p-6 ${
                      activeHoveredZone === 'good'
                        ? 'scale-[1.02] border-emerald-500 bg-emerald-100/90 shadow-xl'
                        : 'border-emerald-400 bg-emerald-50/75 hover:border-emerald-500 hover:bg-emerald-50 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-600 bg-white text-3xl shadow-xs">
                          <span role="img" aria-label="Gigi">
                            🦷
                          </span>
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">
                            “BAIK UNTUK GIGI”
                          </h2>
                          <p className="text-xs font-semibold text-emerald-800 sm:text-sm">
                            Makanan sehat penguat email gigi · {goodBasket.length}/5 Terkumpul
                          </p>
                        </div>
                      </div>

                      <span className="btn-3d-emerald hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-bold text-white whitespace-nowrap shrink-0">
                        Masukkan ke Sini
                      </span>
                    </div>

                    {/* Collected Good Foods Inside Basket */}
                    <div className="my-4 min-h-[96px] rounded-2xl border-2 border-dashed border-emerald-300 bg-white/80 p-3">
                      {goodBasket.length === 0 ? (
                        <div className="flex h-full min-h-[72px] flex-col items-center justify-center text-center text-emerald-800/80">
                          <p className="font-display text-sm font-semibold sm:text-base">
                            Seret makanan yang sehat untuk gigi ke kotak ini!
                          </p>
                          <p className="mt-0.5 text-xs">
                            (Atau ketuk kotak ini untuk memasukkan{' '}
                            <strong>{selectedFood?.name}</strong>)
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {goodBasket.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50/60 p-1.5 text-center"
                            >
                              <FoodIllustration3D
                                foodId={item.id}
                                className="h-12 w-12 sm:h-14 sm:w-14"
                              />
                              <span className="mt-1 font-display text-xs font-bold text-emerald-950">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                      <span>✓ Membantu gigi kuat & bersih</span>
                      <span className="tabular-nums">+10 Poin / Makanan</span>
                    </div>
                  </div>

                  {/* Category 2: 🍭 PERLU DIBATASI */}
                  <div
                    ref={limitZoneRef}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (htmlDragHoveredZone !== 'limit') {
                        setHtmlDragHoveredZone('limit');
                      }
                    }}
                    onDragLeave={() => setHtmlDragHoveredZone(null)}
                    onDrop={(e) => handleHtmlDrop(e, 'limit')}
                    onClick={() => {
                      if (selectedFood) {
                        evaluateDrop(selectedFood, 'limit');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && selectedFood) {
                        e.preventDefault();
                        evaluateDrop(selectedFood, 'limit');
                      }
                    }}
                    aria-label="Kotak Kategori Perlu Dibatasi"
                    className={`group relative flex min-h-[250px] flex-col justify-between rounded-3xl border-4 p-5 transition-all cursor-pointer sm:p-6 ${
                      activeHoveredZone === 'limit'
                        ? 'scale-[1.02] border-amber-500 bg-amber-100/90 shadow-xl'
                        : 'border-amber-400 bg-amber-50/75 hover:border-amber-500 hover:bg-amber-50 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-600 bg-white text-3xl shadow-xs">
                          <span role="img" aria-label="Permen Lolipop">
                            🍭
                          </span>
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold tracking-tight text-amber-950 sm:text-2xl">
                            “PERLU DIBATASI”
                          </h2>
                          <p className="text-xs font-semibold text-amber-900 sm:text-sm">
                            Makanan manis & asam tinggi gula · {limitBasket.length}/5 Terkumpul
                          </p>
                        </div>
                      </div>

                      <span className="btn-3d-amber hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-bold text-white whitespace-nowrap shrink-0">
                        Masukkan ke Sini
                      </span>
                    </div>

                    {/* Collected Limit Foods Inside Basket */}
                    <div className="my-4 min-h-[96px] rounded-2xl border-2 border-dashed border-amber-300 bg-white/80 p-3">
                      {limitBasket.length === 0 ? (
                        <div className="flex h-full min-h-[72px] flex-col items-center justify-center text-center text-amber-900/80">
                          <p className="font-display text-sm font-semibold sm:text-base">
                            Seret makanan manis yang perlu dibatasi ke kotak ini!
                          </p>
                          <p className="mt-0.5 text-xs">
                            (Atau ketuk kotak ini untuk memasukkan{' '}
                            <strong>{selectedFood?.name}</strong>)
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {limitBasket.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center rounded-xl border border-amber-200 bg-amber-50/60 p-1.5 text-center"
                            >
                              <FoodIllustration3D
                                foodId={item.id}
                                className="h-12 w-12 sm:h-14 sm:w-14"
                              />
                              <span className="mt-1 font-display text-xs font-bold text-amber-950">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                      <span>▲ Jangan dikonsumsi terlalu sering</span>
                      <span className="tabular-nums">+10 Poin / Makanan</span>
                    </div>
                  </div>
                </section>

                {/* DRAGGABLE FOOD TRAY: ALL REMAINING FOODS + QUICK ACTION BAR */}
                <section
                  aria-label="Daftar Makanan"
                  className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-xs sm:p-6"
                >
                  <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                        <Hand className="h-4 w-4" />
                        <span>MEJA MAKANAN INTERAKTIF · SERET & LEPAS (DRAG & DROP)</span>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                        Pilih Makanan dan Masukkan ke Kategori yang Sesuai
                      </h3>
                    </div>

                    {/* Large Quick-Action Buttons for Selected Food (Great for Mobile/Tablet/Keyboard) */}
                    {selectedFood && (
                      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl bg-slate-100 p-2">
                        <div className="flex items-center gap-2 px-2">
                          <FoodIllustration3D
                            foodId={selectedFood.id}
                            className="h-9 w-9 shrink-0"
                          />
                          <div className="text-left">
                            <div className="text-[11px] font-semibold text-slate-500">
                              Makanan Terpilih:
                            </div>
                            <div className="font-display text-sm font-bold text-slate-900">
                              {selectedFood.name}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => evaluateDrop(selectedFood, 'good')}
                          className="btn-3d-emerald inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold text-white sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>🦷 Baik untuk Gigi</span>
                        </button>

                        <button
                          onClick={() => evaluateDrop(selectedFood, 'limit')}
                          className="btn-3d-amber inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold text-white sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>🍭 Perlu Dibatasi</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Grid of Draggable 3D Cartoon Food Cards */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {unsortedFoods.map((food) => {
                      const isSelected = selectedFood?.id === food.id;
                      const isShaking = wrongShakeId === food.id;
                      const isBeingDragged = pointerDrag?.food.id === food.id;

                      return (
                        <div
                          key={food.id}
                          draggable
                          onDragStart={(e) => handleHtmlDragStart(e, food)}
                          onDragEnd={() => setHtmlDragHoveredZone(null)}
                          onPointerDown={(e) => {
                            // Only left mouse button or touch
                            if (e.button !== 0 && e.pointerType === 'mouse') return;
                            sound.playPickup();
                            setSelectedFoodId(food.id);
                            pointerStartPos.current = {
                              x: e.clientX,
                              y: e.clientY,
                              food,
                            };
                          }}
                          onClick={() => {
                            sound.playClick();
                            setSelectedFoodId(food.id);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              sound.playClick();
                              setSelectedFoodId(food.id);
                            }
                          }}
                          style={{ touchAction: 'none' }}
                          aria-label={`Makanan ${food.name}. ${food.shortHint}`}
                          className={`card-3d relative flex flex-col items-center justify-between rounded-2xl p-4 text-center select-none cursor-grab active:cursor-grabbing ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50/40 ring-3 ring-sky-400/40'
                              : 'border-slate-200 bg-white'
                          } ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'} ${
                            isShaking ? 'animate-bounce border-amber-500 bg-amber-50' : ''
                          }`}
                        >
                          {/* 3D Cartoon Food Illustration */}
                          <div className="pointer-events-none my-1 flex items-center justify-center">
                            <FoodIllustration3D
                              foodId={food.id}
                              className="h-24 w-24 sm:h-28 sm:w-28 transition-transform group-hover:scale-105"
                            />
                          </div>

                          {/* Food Title & Kid-Friendly Hint */}
                          <div className="pointer-events-none mt-2 w-full">
                            <h4 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
                              {food.name}
                            </h4>
                            <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-500">
                              {food.shortHint}
                            </p>
                          </div>

                          {/* Drag Affordance Caption */}
                          <div className="pointer-events-none mt-3 w-full border-t border-slate-100 pt-2 text-[11px] font-semibold text-sky-700">
                            Seret ke Kotak Kategori
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Quiet Educational Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="font-semibold text-slate-700">
            Pilih Makanan Untuk Gigimu — Game Edukasi Kesehatan Gigi Anak (Usia 6–12 Tahun)
          </p>
          <p>
            Bebas Iklan · Tanpa Data Pribadi · Tanpa Login · Sikat Gigi 2 Kali Sehari
          </p>
        </div>
      </footer>
    </div>
  );
}
