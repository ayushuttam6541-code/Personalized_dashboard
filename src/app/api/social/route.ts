import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/types/content';

// Realistic, compact mock community discussion posts (no fake celebrities, no random Unsplash image URLs)
const SOCIAL_POSTS: ContentItem[] = [
  {
    id: 'social-1',
    type: 'social',
    title: 'Discussion on frontend state management & caching strategies',
    description:
      'Co-locating server state with query cache clients like RTK Query while keeping client UI state local and minimal has simplified our architecture considerably.',
    category: 'technology',
    url: 'https://github.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    source: 'Tech Community',
    metadata: {
      author: 'Alex Morgan',
      handle: '@alexm_dev',
      likes: 142,
      retweets: 28,
    },
  },
  {
    id: 'social-2',
    type: 'social',
    title: 'Best practices for asynchronous team synchronization across timezones',
    description:
      'Writing structured project updates and clear async documentation reduces sync meetings by over 60% and gives developers uninterrupted focus blocks.',
    category: 'business',
    url: 'https://github.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    source: 'Workplace Forum',
    metadata: {
      author: 'Jordan Lee',
      handle: '@jordan_lead',
      likes: 89,
      retweets: 15,
    },
  },
  {
    id: 'social-3',
    type: 'social',
    title: 'New spectrographic insights from deep-space exoplanet surveys',
    description:
      'Recent atmospheric data captures distinct absorption bands pointing to complex cloud chemistry on distant super-Earths, expanding astrobiology models.',
    category: 'science',
    url: 'https://github.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    source: 'Astro Science',
    metadata: {
      author: 'Dr. Sarah Chen',
      handle: '@schen_astro',
      likes: 215,
      retweets: 47,
    },
  },
  {
    id: 'social-4',
    type: 'social',
    title: 'Cinematography and camera lighting breakdowns from recent indie films',
    description:
      'The shift towards practical lighting fixtures on set creates far more natural falloff compared to digital relighting in post-production.',
    category: 'entertainment',
    url: 'https://github.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    source: 'Cinema Guild',
    metadata: {
      author: 'Marcus Rivera',
      handle: '@mrivera_film',
      likes: 178,
      retweets: 36,
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(30, parseInt(searchParams.get('limit') || '4', 10)));

    let posts = [...SOCIAL_POSTS];

    if (category && category !== 'all') {
      posts = posts.filter((p) => p.category === category);
    }

    if (search) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.metadata?.author?.toLowerCase().includes(search) ||
          p.metadata?.handle?.toLowerCase().includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      items: paginatedPosts,
      page,
      hasMore: startIndex + limit < posts.length,
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      (error as { digest: string }).digest === 'NEXT_PRERENDER_INTERRUPTED'
    ) {
      throw error;
    }
    return NextResponse.json({ error: 'Failed to fetch social posts' }, { status: 500 });
  }
}
