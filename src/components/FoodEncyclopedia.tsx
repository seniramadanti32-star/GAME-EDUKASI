import React, { useState } from 'react';
import { INITIAL_FOODS, FoodCategory, FoodItem } from '../data/foods';
import { FoodIllustration3D } from './Illustration3D';
import { sound } from '../utils/sound';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface FoodEncyclopediaProps {
  onBackToGame: () => void;
}

export const FoodEncyclopedia: React.FC<FoodEncyclopediaProps> = ({ onBackToGame }) => {
  const [filter, setFilter] = useState<'all' | FoodCategory>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(INITIAL_FOODS[0]);

  const filteredFoods =
    filter === 'all'
      ? INITIAL_FOODS
      : INITIAL_FOODS.filter((item) => item.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Header Row */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-sky-700">
            Kamus Gizi Gigi · 10 Makanan Pilihan
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Kenali Makanan untuk Kesehatan Gigimu
          </h2>
        </div>

        {/* Interactive Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-slate-200/80 p-1">
            <button
              onClick={() => {
                sound.playClick();
                setFilter('all');
              }}
              className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (10)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter('good');
              }}
              className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'good'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🦷 Baik untuk Gigi (5)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter('limit');
              }}
              className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'limit'
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍭 Perlu Dibatasi (5)
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onBackToGame();
            }}
            className="btn-3d-primary inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 font-display text-sm font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Kembali Bermain
          </button>
        </div>
      </div>

      {/* Main Split View: Food Grid + Detailed Spotlight */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Interactive Grid of Foods */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
          {filteredFoods.map((food) => {
            const isSelected = selectedFood.id === food.id;
            const isGood = food.category === 'good';
            return (
              <button
                key={food.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedFood(food);
                }}
                className={`card-3d flex flex-col items-center rounded-2xl p-4 text-center cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-400/50'
                    : 'border-slate-200'
                }`}
              >
                <FoodIllustration3D foodId={food.id} className="h-20 w-20" />
                <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                  {food.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs font-semibold">
                  {isGood ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      Baik untuk Gigi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      Perlu Dibatasi
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed 3D Spotlight Card */}
        <div className="lg:col-span-5">
          <div className="card-3d sticky top-24 rounded-3xl p-6">
            <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center">
              <FoodIllustration3D
                foodId={selectedFood.id}
                className="h-32 w-32 animate-float-slow"
              />
              <h3 className="mt-3 font-display text-2xl font-bold text-slate-900">
                {selectedFood.name}
              </h3>
              {/* Clean Unboxed Metadata */}
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <span>
                  {selectedFood.category === 'good'
                    ? '🦷 Kategori: Baik untuk Gigi'
                    : '🍭 Kategori: Perlu Dibatasi'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedFood.nutrientTag}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedFood.textureTag}</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h4 className="font-display text-base font-bold text-slate-900">
                  Mengapa Penting untuk Gigimu?
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedFood.dentalFact}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-display text-base font-bold text-slate-900">
                  Tips Sehat Setelah Makan:
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedFood.tipAfterEating}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
