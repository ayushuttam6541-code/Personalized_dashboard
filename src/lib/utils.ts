import { Category, ContentType } from '@/types/content';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function formatCompactNumber(num?: number): string {
  if (num === undefined || num === null) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function getCategoryBadgeColor(category?: Category | string | null) {
  if (!category) {
    return {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-600 dark:text-zinc-400',
      border: 'border-zinc-500/20',
    };
  }
  const map: Record<Category, { bg: string; text: string; border: string }> = {
    technology: {
      bg: 'bg-blue-500/10 dark:bg-blue-400/15',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
    },
    business: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/15',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
    },
    entertainment: {
      bg: 'bg-purple-500/10 dark:bg-purple-400/15',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
    },
    sports: {
      bg: 'bg-orange-500/10 dark:bg-orange-400/15',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/20',
    },
    science: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-400/15',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/20',
    },
    health: {
      bg: 'bg-rose-500/10 dark:bg-rose-400/15',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/20',
    },
  };
  return (
    map[category as Category] || {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-600 dark:text-zinc-400',
      border: 'border-zinc-500/20',
    }
  );
}

export function getTypeBadgeInfo(type: ContentType) {
  switch (type) {
    case 'news':
      return {
        label: 'News',
        badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        ctaText: 'Read Article',
      };
    case 'movie':
      return {
        label: 'Movie',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        ctaText: 'View Movie',
      };
    case 'social':
      return {
        label: 'Social',
        badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        ctaText: 'View Post',
      };
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or access errors
  }
}
