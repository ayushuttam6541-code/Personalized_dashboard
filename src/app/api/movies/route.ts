import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/types/content';

async function fetchTMDBWithRetry(url: string, retries = 2): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }
  throw lastError;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const category = searchParams.get('category');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    const apiKey = process.env.TMDB_API_KEY || '26a034b3c50ceb09a91ffd6f118611fb';

    // Map dashboard categories to TMDB genre IDs when category filter is selected
    const GENRE_MAP: Record<string, number> = {
      science: 878, // Science Fiction
      technology: 878, // Sci-Fi & Tech
      business: 99, // Documentary
      sports: 18, // Drama / Sports
      health: 99, // Documentary
    };

    let url: string;
    if (search) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        search
      )}&page=${page}`;
    } else if (category && category !== 'all' && category !== 'entertainment' && GENRE_MAP[category]) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${GENRE_MAP[category]}&page=${page}&sort_by=popularity.desc`;
    } else {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`;
    }

    const res = await fetchTMDBWithRetry(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB API responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const totalPages = typeof data.total_pages === 'number' ? data.total_pages : 1;
    const rawResults = Array.isArray(data.results) ? data.results : [];

    // Stop if page exceeds total_pages
    const hasMore = page < totalPages && rawResults.length > 0;

    const movies: ContentItem[] = rawResults.map(
      (m: {
        id: number;
        title: string;
        overview?: string;
        backdrop_path?: string;
        poster_path?: string;
        vote_average?: number;
        vote_count?: number;
        release_date?: string;
      }) => {
        // Build image URL strictly from TMDB paths; no Unsplash or random external fallbacks
        let imageUrl: string | undefined;
        if (m.poster_path) {
          imageUrl = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
        } else if (m.backdrop_path) {
          imageUrl = `https://image.tmdb.org/t/p/w780${m.backdrop_path}`;
        }

        return {
          id: `tmdb-${m.id}`,
          type: 'movie' as const,
          title: m.title || 'Untitled Movie',
          description: m.overview || undefined,
          image: imageUrl,
          category: 'entertainment',
          url: `https://www.themoviedb.org/movie/${m.id}`,
          publishedAt: m.release_date
            ? new Date(m.release_date).toISOString()
            : undefined,
          source: 'TMDB',
          metadata: {
            rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : undefined,
            voteCount: m.vote_count,
          },
        };
      }
    );

    return NextResponse.json({
      items: movies,
      page,
      totalPages,
      hasMore,
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
    return NextResponse.json(
      { error: 'Failed to fetch movies from TMDB' },
      { status: 500 }
    );
  }
}
