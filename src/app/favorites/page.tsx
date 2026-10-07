'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearFavorites } from '@/store/favoritesSlice';
import { ContentCard } from '@/components/ContentCard';
import { EmptyState } from '@/components/LoadingState';
import { ContentType } from '@/types/content';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');

  const filteredItems = favorites.filter(
    (item) => selectedType === 'all' || item.type === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent p-6 dark:border-zinc-800/80 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Heart className="h-5 w-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved Library</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            My Favorites
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Articles, movie picks, and community posts you&apos;ve bookmarked for later reference.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all items from your favorites library?')) {
                  dispatch(clearFavorites());
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
              Clear All ({favorites.length})
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs if favorites exist */}
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(['all', 'news', 'movie', 'social'] as const).map((type) => {
            const count =
              type === 'all'
                ? favorites.length
                : favorites.filter((i) => i.type === type).length;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                  selectedType === type
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{type === 'all' ? 'All' : `${type}s`}</span>
                <span className="rounded-full bg-zinc-200/70 px-1.5 py-0.2 text-[10px] dark:bg-zinc-800">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content / Empty state */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <EmptyState
            icon={Heart}
            title="No favorites saved yet"
            description="Browse your personalized feed or trending section and click the heart icon on any card to save it here."
          />
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <span>Explore Your Feed</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites in this category"
          description="You haven't bookmarked any items for the selected filter."
          actionText="Show All Saved Favorites"
          onAction={() => setSelectedType('all')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
