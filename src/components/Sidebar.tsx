'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  Settings,
  X,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { closeMobileMenu } from '@/store/preferencesSlice';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const reduxOpen = useAppSelector((state) => state.preferences.isMobileMenuOpen);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const selectedCategories = useAppSelector((state) => state.preferences.categories);

  const activeIsOpen = isOpen !== undefined ? isOpen : reduxOpen;
  const handleClose = onClose || (() => dispatch(closeMobileMenu()));

  const navItems = [
    {
      name: 'Personalized Feed',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      name: 'Preferences & Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {activeIsOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation overlay"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClose();
          }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200/80 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-800/80 dark:bg-zinc-950 md:sticky md:top-0 md:h-screen md:shrink-0 md:self-start md:translate-x-0 ${
          activeIsOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Logo & Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200/80 px-6 dark:border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5" onClick={handleClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                PulseHub
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                Personalized
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                          : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats / Active Channels Widget */}
          <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-zinc-100/50 p-3.5 dark:border-zinc-800/80 dark:from-zinc-900/60 dark:to-zinc-900/30">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                Active Topics
              </span>
              <span className="text-[11px] font-semibold text-zinc-500">
                {selectedCategories.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-600 shadow-2xs capitalize dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {cat}
                </span>
              ))}
            </div>

            <Link
              href="/settings"
              onClick={handleClose}
              className="mt-3 flex items-center justify-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <Sparkles className="h-3 w-3" /> Customize Topics
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-zinc-200/80 p-3 text-center text-[11px] text-zinc-400 dark:border-zinc-800/80 dark:text-zinc-500">
          PulseHub v1.0 • Internship Edition
        </div>
      </aside>
    </>
  );
}
