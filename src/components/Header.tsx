'use client';

import React from 'react';
import { Moon, Sun, Bell, Menu, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { toggleTheme, toggleMobileMenu } from '@/store/preferencesSlice';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({
  onMobileMenuToggle,
  title = 'Personalized Dashboard',
  subtitle = 'Discover curated news, movies & social posts tailored to your interests',
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const handleToggle = onMobileMenuToggle || (() => dispatch(toggleMobileMenu()));

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" /> Live
            </span>
          </div>
          <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative rounded-xl border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-600" />
          )}
        </button>

        {/* Notifications / Activity badge */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-xl border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          <Bell className="h-4 w-4" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {favoritesCount > 9 ? '9+' : favoritesCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* User Account Info */}
        <div className="flex items-center gap-2 pl-1">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-semibold text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
            AR
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-zinc-900 dark:text-white">Ayush Raj</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Software Engineer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
