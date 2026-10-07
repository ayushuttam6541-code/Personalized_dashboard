'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Moon,
  Sun,
  RotateCcw,
  Clock,
  Trash2,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Category } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  toggleCategory,
  setTheme,
  setAutoRefreshInterval,
  resetFeedOrder,
  resetPreferences,
} from '@/store/preferencesSlice';
import { clearFavorites } from '@/store/favoritesSlice';

const ALL_CATEGORIES: { id: Category; label: string; desc: string }[] = [
  { id: 'technology', label: 'Technology', desc: 'AI, software, developer tools & startups' },
  { id: 'business', label: 'Business', desc: 'Markets, VC funding, economics & leadership' },
  { id: 'entertainment', label: 'Entertainment', desc: 'Movies, streaming, music & culture' },
  { id: 'sports', label: 'Sports', desc: 'Football, basketball, athletics & fitness' },
  { id: 'science', label: 'Science', desc: 'Space exploration, physics, biotechnology' },
  { id: 'health', label: 'Health', desc: 'Longevity, medicine, wellness & nutrition' },
];

export function SettingsPanel() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);

  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleToggleCategory = (cat: Category) => {
    dispatch(toggleCategory(cat));
  };

  const handleResetPreferences = () => {
    dispatch(resetPreferences());
    showFeedback('Preferences reset to default configuration');
  };

  const handleResetFeedOrder = () => {
    dispatch(resetFeedOrder());
    showFeedback('Feed card custom arrangement reset');
  };

  const handleClearFavorites = () => {
    if (confirm('Are you sure you want to clear all your saved favorites?')) {
      dispatch(clearFavorites());
      showFeedback('Favorites library cleared');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Banner / Success Toast */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          {feedback}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Sliders className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Dashboard Preferences
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tailor your personalized feed, topics of interest, refresh intervals, and appearance.
        </p>
      </div>

      {/* User Profile Card */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-md">
            AR
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Ayush Raj
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Software Engineer • Dashboard Administrator
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Active Workspace Session
            </div>
          </div>
        </div>
      </section>

      {/* 1. Category Selection */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Preferred Topic Categories
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select which areas you would like to track in your unified personalized feed.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {preferences.categories.length} selected
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = preferences.categories.includes(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleToggleCategory(cat.id)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-50/50 shadow-xs dark:border-indigo-500/50 dark:bg-indigo-950/20'
                    : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-bold text-zinc-900 capitalize dark:text-white">
                    {cat.label}
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                        : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Theme & Appearance */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-8">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Appearance Mode
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose your preferred color scheme for day or night productivity.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 max-w-md">
          <button
            type="button"
            onClick={() => dispatch(setTheme('light'))}
            className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
              preferences.theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 dark:border-indigo-500'
                : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300'
            }`}
          >
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Sun className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Light Mode</div>
              <div className="text-xs text-zinc-500">Clean & bright</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setTheme('dark'))}
            className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
              preferences.theme === 'dark'
                ? 'border-indigo-500 bg-indigo-950/30 text-white'
                : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300'
            }`}
          >
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
              <Moon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Dark Mode</div>
              <div className="text-xs text-zinc-500">Sleek & high contrast</div>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Real-Time Auto-Refresh Interval */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-8">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Auto-Refresh Frequency (Real-time Feed)
          </h3>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Set how frequently the dashboard polls for breaking news, trending updates, and social posts.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {[
            { label: 'Manual Only', value: 0 },
            { label: 'Every 30 Seconds', value: 30 },
            { label: 'Every 1 Minute', value: 60 },
            { label: 'Every 5 Minutes', value: 300 },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => dispatch(setAutoRefreshInterval(option.value))}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                preferences.autoRefreshInterval === option.value
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs dark:border-indigo-500 dark:bg-indigo-500'
                  : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Reset & Data Management */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-8">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Data & Arrangement Reset
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Restore default card orders or clear your saved favorites library.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetFeedOrder}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Custom Card Order
          </button>

          <button
            type="button"
            onClick={handleResetPreferences}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Reset All Preferences
          </button>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={handleClearFavorites}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
              Clear Favorites ({favorites.length})
            </button>
          )}
        </div>
      </section>

      {/* Security & API Status note */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:text-zinc-400">
        <ShieldCheck className="h-5 w-5 text-indigo-500" />
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Secure Client Architecture:
          </span>{' '}
          External API credentials are only read server-side via Next.js route handlers. LocalStorage persists user choices across sessions without tracking.
        </div>
      </div>
    </div>
  );
}
