'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Inbox, LucideIcon } from 'lucide-react';

export function LoadingCardSkeleton() {
  return (
    <div
      data-testid="loading-card"
      className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/90"
    >
      <div className="aspect-video w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-1.5 pt-2">
          <div className="h-3 w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-3 w-4/5 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="h-9 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function LoadingState({ count = 6 }: { count?: number }) {
  return (
    <div
      data-testid="loading-state"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
    >
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div
      data-testid="empty-state"
      className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300/80 bg-zinc-50/60 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Failed to load content',
  message = 'An unexpected error occurred. Please check your connection and try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      data-testid="error-state"
      className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-xs text-zinc-600 dark:text-zinc-400">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}
