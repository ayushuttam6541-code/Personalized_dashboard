'use client';

import React, { useState } from 'react';
import {
  Heart,
  ExternalLink,
  Star,
  MessageSquare,
  Repeat2,
  Clock,
  Share2,
  Check,
  GripVertical,
  Newspaper,
  Film,
  Sparkles,
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import {
  formatCompactNumber,
  formatRelativeTime,
  getCategoryBadgeColor,
  getTypeBadgeInfo,
} from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { toggleFavorite } from '@/store/favoritesSlice';

interface ContentCardProps {
  item: ContentItem;
  dragHandleProps?: Record<string, unknown>;
  isDraggable?: boolean;
}

export function ContentCard({ item, dragHandleProps, isDraggable = false }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const isFavorited = useAppSelector((state) =>
    state.favorites.items.some((fav) => fav.id === item.id)
  );

  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColor = getCategoryBadgeColor(item.category);
  const typeInfo = getTypeBadgeInfo(item.type);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const TypeIcon =
    item.type === 'news' ? Newspaper : item.type === 'movie' ? Film : MessageSquare;

  return (
    <article
      data-testid="content-card"
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:hover:border-zinc-700 dark:hover:shadow-indigo-500/5"
    >
      {/* Top Banner / Image Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {!imageError && item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 via-zinc-100 to-purple-500/10 dark:from-indigo-950/40 dark:via-zinc-800 dark:to-purple-950/40 text-zinc-400">
            <TypeIcon className="h-10 w-10 text-indigo-400 opacity-60" />
            <span className="mt-1 text-xs font-medium text-zinc-400">{item.source}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Drag Handle (if draggable in feed) */}
        {isDraggable && dragHandleProps && (
          <button
            type="button"
            {...dragHandleProps}
            aria-label="Drag to reorder card"
            className="absolute top-2.5 left-2.5 flex h-8 w-8 cursor-grab items-center justify-center rounded-xl bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        {/* Badges on Top */}
        <div className={`absolute top-2.5 flex items-center gap-1.5 ${isDraggable ? 'left-12' : 'left-2.5'}`}>
          <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold backdrop-blur-md ${typeInfo.badgeClass}`}
          >
            <TypeIcon className="h-3 w-3" />
            {typeInfo.label}
          </span>
          {item.category && (
            <span
              className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold capitalize backdrop-blur-md ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}
            >
              {item.category}
            </span>
          )}
        </div>

        {/* Favorite & Share Buttons on Top Right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Copy content link"
            title={copied ? 'Link copied' : 'Share link'}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`flex h-8 w-8 items-center justify-center rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'bg-black/40 text-white/90 hover:bg-black/70 hover:text-white'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? 'fill-current text-white' : ''}`}
            />
          </button>
        </div>

        {/* Source & Relative Time bottom banner */}
        <div className="absolute right-3 bottom-2.5 left-3 flex items-center justify-between text-xs text-white/90">
          <span className="font-semibold tracking-wide drop-shadow-xs">{item.source || 'Featured'}</span>
          <span className="drop-shadow-xs">{formatRelativeTime(item.publishedAt)}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
          )}
        </div>

        {/* Specific Metadata & CTA Area */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Metadata Display */}
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {item.type === 'movie' && item.metadata?.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {item.metadata.rating}
                {item.metadata.voteCount && (
                  <span className="font-normal text-zinc-400">
                    ({formatCompactNumber(item.metadata.voteCount)})
                  </span>
                )}
              </span>
            )}

            {item.type === 'social' && (
              <>
                {item.metadata?.handle && (
                  <span className="font-medium text-indigo-500">
                    {item.metadata.handle}
                  </span>
                )}
                {item.metadata?.likes !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {formatCompactNumber(item.metadata.likes)}
                  </span>
                )}
                {item.metadata?.retweets !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Repeat2 className="h-3 w-3" />
                    {formatCompactNumber(item.metadata.retweets)}
                  </span>
                )}
              </>
            )}

            {item.type === 'news' && (
              <>
                {item.metadata?.author && (
                  <span className="truncate max-w-[130px]">By {item.metadata.author}</span>
                )}
                {item.metadata?.readingTime && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.metadata.readingTime}
                  </span>
                )}
              </>
            )}

            {item.metadata?.tag && (
              <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Sparkles className="h-2.5 w-2.5" />
                {item.metadata.tag}
              </span>
            )}
          </div>

          {/* CTA Link Button */}
          <a
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${typeInfo.ctaText} for ${item.title}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-100 py-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            <span>{typeInfo.ctaText}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
