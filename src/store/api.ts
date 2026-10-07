import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContentItem } from '@/types/content';

export interface FeedParams {
  category?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FeedResponse {
  items: ContentItem[];
  hasMore: boolean;
  page: number;
}

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Feed'],
  endpoints: (builder) => ({
    getFeed: builder.query<FeedResponse, FeedParams>({
      async queryFn(
        { category = 'all', type = 'all', search = '', page = 1, limit = 8 },
        _api,
        _extraOptions,
        baseQuery
      ) {
        const fetchTasks = [];

        if (type === 'all' || type === 'news') {
          const params = new URLSearchParams();
          if (category !== 'all') params.set('category', category);
          if (search) params.set('search', search);
          params.set('page', String(page));
          params.set('limit', String(limit));
          fetchTasks.push(baseQuery(`/news?${params.toString()}`));
        }

        if (type === 'all' || type === 'movie') {
          const params = new URLSearchParams();
          if (category !== 'all') params.set('category', category);
          if (search) params.set('search', search);
          params.set('page', String(page));
          fetchTasks.push(baseQuery(`/movies?${params.toString()}`));
        }

        if (type === 'all' || type === 'social') {
          const params = new URLSearchParams();
          if (category !== 'all') params.set('category', category);
          if (search) params.set('search', search);
          params.set('page', String(page));
          params.set('limit', String(Math.max(2, Math.floor(limit / 2))));
          fetchTasks.push(baseQuery(`/social?${params.toString()}`));
        }

        const results = await Promise.all(fetchTasks);

        const errors = results.filter((r) => r.error);
        if (errors.length === fetchTasks.length) {
          // All requested sources returned errors
          return {
            error: errors[0]?.error || { status: 500, data: 'Failed to fetch content' },
          };
        }

        let combined: ContentItem[] = [];
        let hasMore = false;

        for (const res of results) {
          if (res.data && typeof res.data === 'object' && 'items' in res.data) {
            const data = res.data as { items: ContentItem[]; hasMore?: boolean };
            if (Array.isArray(data.items)) {
              combined = combined.concat(data.items);
            }
            if (data.hasMore) {
              hasMore = true;
            }
          }
        }

        if (combined.length === 0 && errors.length > 0) {
          return {
            error: errors[0]?.error || { status: 500, data: 'Failed to fetch content' },
          };
        }

        // Sort combined feed by publication time descending
        combined.sort((a, b) => {
          const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return timeB - timeA;
        });

        return {
          data: {
            items: combined,
            hasMore,
            page,
          },
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { category = 'all', type = 'all', search = '' } = queryArgs;
        return `${endpointName}(${category}_${type}_${search})`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          currentCache.items = newItems.items;
          currentCache.hasMore = newItems.hasMore;
          currentCache.page = newItems.page;
        } else {
          const existingIds = new Set(currentCache.items.map((i) => i.id));
          const incomingUnique = newItems.items.filter((i) => !existingIds.has(i.id));
          currentCache.items.push(...incomingUnique);
          currentCache.hasMore = newItems.hasMore;
          currentCache.page = newItems.page;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ['Feed'],
    }),
  }),
});

export const { useGetFeedQuery } = contentApi;
