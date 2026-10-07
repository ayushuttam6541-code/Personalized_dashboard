'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  Newspaper,
  Film,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Category, ContentType } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useGetFeedQuery } from '@/store/api';
import { setFeedOrder, resetFeedOrder } from '@/store/preferencesSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { ContentGrid } from './ContentGrid';
import { LoadingState, EmptyState, ErrorState } from './LoadingState';

const TYPE_FILTERS: { id: ContentType | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Content', icon: Layers },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'movie', label: 'Movies', icon: Film },
  { id: 'social', label: 'Social', icon: MessageSquare },
];

const CATEGORY_TABS: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

export function Dashboard() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [sortByTrending, setSortByTrending] = useState(false);
  const [page, setPage] = useState(1);

  // Sentinel ref for infinite scroll intersection observer
  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const isRequestInFlightRef = useRef(false);

  // Reset pagination when search input changes
  const prevSearchRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevSearchRef.current !== debouncedSearch) {
      prevSearchRef.current = debouncedSearch;
      setPage(1);
    }
  }, [debouncedSearch]);

  const {
    data: feedData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetFeedQuery({
    category: selectedCategory,
    type: selectedType,
    search: debouncedSearch,
    page,
  });

  const hasMore = feedData?.hasMore ?? false;
  const items = feedData?.items ?? [];

  // Unlock pagination guard when fetching completes
  useEffect(() => {
    if (!isFetching) {
      isRequestInFlightRef.current = false;
    }
  }, [isFetching]);

  // Filter change handlers that reset pagination
  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleTypeChange = (type: ContentType | 'all') => {
    setSelectedType(type);
    setPage(1);
  };

  // Infinite scroll trigger: load next page when sentinel enters viewport
  const handleLoadMore = useCallback(() => {
    if (isRequestInFlightRef.current || isFetching || isLoading || !hasMore || error) {
      return;
    }
    isRequestInFlightRef.current = true;
    setPage((prev) => prev + 1);
  }, [isFetching, isLoading, hasMore, error]);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isRequestInFlightRef.current && !isFetching) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, error, isFetching]);

  // Real-time background auto-refresh
  useEffect(() => {
    if (preferences.autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        refetch();
      }, preferences.autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [preferences.autoRefreshInterval, refetch]);

  const displayItems = [...items];

  // If user selected trending sort, prioritize high rating and engagement
  if (sortByTrending) {
    displayItems.sort((a, b) => {
      const scoreA =
        (a.metadata?.rating ? a.metadata.rating * 1000 : 0) +
        (a.metadata?.likes ? a.metadata.likes : 0);
      const scoreB =
        (b.metadata?.rating ? b.metadata.rating * 1000 : 0) +
        (b.metadata?.likes ? b.metadata.likes : 0);
      return scoreB - scoreA;
    });
  } else if (
    preferences.feedOrder.length > 0 &&
    !debouncedSearch &&
    selectedCategory === 'all' &&
    selectedType === 'all'
  ) {
    // Apply persisted drag and drop order when not filtering
    const orderMap = new Map<string, number>();
    preferences.feedOrder.forEach((id, index) => orderMap.set(id, index));
    displayItems.sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? 999;
      const orderB = orderMap.get(b.id) ?? 999;
      return orderA - orderB;
    });
  }

  const isFiltered =
    debouncedSearch ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    sortByTrending;
  const canDrag = !isFiltered && displayItems.length > 1;

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search news, movies, or social posts..."
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSortByTrending((prev) => !prev)}
              aria-label="Toggle trending items view"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                sortByTrending
                  ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:border-orange-400 dark:bg-orange-400/15 dark:text-orange-400'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>Trending</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                refetch();
              }}
              disabled={isFetching}
              aria-label="Refresh feed"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-indigo-500' : ''}`}
              />
              <span>{isFetching ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Content Type Filter Tabs */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {TYPE_FILTERS.map((typeOption) => {
              const Icon = typeOption.icon;
              const isActive = selectedType === typeOption.id;

              return (
                <button
                  key={typeOption.id}
                  type="button"
                  onClick={() => handleTypeChange(typeOption.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{typeOption.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden text-xs text-zinc-400 dark:text-zinc-500 md:block">
            {displayItems.length} items loaded
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="flex items-center gap-1 pr-2 text-zinc-400 dark:text-zinc-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Category:
          </span>
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-600 font-semibold dark:bg-indigo-400/20 dark:text-indigo-400'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading && page === 1 ? (
        <LoadingState count={6} />
      ) : error && page === 1 ? (
        <ErrorState onRetry={() => refetch()} />
      ) : displayItems.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={debouncedSearch ? 'No matches found' : 'No content found'}
          description={
            debouncedSearch
              ? `No content found matching "${debouncedSearch}". Try another keyword.`
              : 'Try selecting a different topic or resetting filters.'
          }
          actionText={debouncedSearch ? 'Clear Search' : 'Reset Category'}
          onAction={() => {
            if (debouncedSearch) setSearchInput('');
            else handleCategoryChange('all');
          }}
        />
      ) : (
        <>
          <ContentGrid
            items={displayItems}
            enableDrag={canDrag}
            onReorder={(newOrder) => dispatch(setFeedOrder(newOrder))}
            onResetOrder={() => dispatch(resetFeedOrder())}
            hasCustomOrder={preferences.feedOrder.length > 0}
          />

          {/* Infinite Scroll Sentinel element */}
          {hasMore && !error && (
            <div
              ref={observerTargetRef}
              className="h-10 w-full"
              aria-hidden="true"
            />
          )}

          {/* Bottom Loading Indicator while fetching more pages */}
          {isFetching && page > 1 && (
            <div className="flex items-center justify-center gap-2.5 py-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>Fetching additional updates from live feeds...</span>
            </div>
          )}

          {/* Error Banner when fetching subsequent pages */}
          {error && page > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-red-200/80 bg-red-50/60 p-4 text-xs dark:border-red-900/40 dark:bg-red-950/20 sm:flex-row">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to load the next batch of content.</span>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 font-semibold text-white shadow-xs hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-600"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* End of Feed Indicator: Only displayed when genuinely no more API pages, not loading, and not on error */}
          {!hasMore && displayItems.length > 0 && !isFetching && !isLoading && !error && (
            <div className="flex items-center justify-center gap-2 py-8 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>You are all caught up • All available content loaded</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
