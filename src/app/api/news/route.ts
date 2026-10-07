import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/types/content';

async function fetchNewsWithRetry(url: string, retries = 2): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 180 } });
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
    const category = searchParams.get('category');
    const search = (searchParams.get('search') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(30, parseInt(searchParams.get('limit') || '10', 10)));

    const apiKey = process.env.NEWS_API_KEY || '27a65e2791bc4011a8a40276a3ab46e3';

    let url: string;

    if (search) {
      if (category && category !== 'all') {
        // top-headlines supports both category and q
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(
          category
        )}&q=${encodeURIComponent(search)}&pageSize=${limit}&page=${page}&apiKey=${apiKey}`;
      } else {
        // everything endpoint searches all news with query q
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          search
        )}&pageSize=${limit}&page=${page}&apiKey=${apiKey}`;
      }
    } else {
      const catParam = category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
      url = `https://newsapi.org/v2/top-headlines?country=us${catParam}&pageSize=${limit}&page=${page}&apiKey=${apiKey}`;
    }

    const res = await fetchNewsWithRetry(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: `NewsAPI responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (data.status !== 'ok') {
      return NextResponse.json(
        { error: data.message || 'NewsAPI error' },
        { status: 500 }
      );
    }

    const rawArticles = Array.isArray(data.articles) ? data.articles : [];

    // Filter out invalid or removed entries
    const validArticles = rawArticles.filter(
      (a: { title?: string; url?: string }) =>
        a.title && a.url && a.title !== '[Removed]'
    );

    // NewsAPI developer/free tier limits queries to the first 100 results
    const maxResults = Math.min(typeof data.totalResults === 'number' ? data.totalResults : 0, 100);
    const hasMore = page * limit < maxResults && validArticles.length > 0;

    const articles: ContentItem[] = validArticles.map(
      (a: {
        title: string;
        description?: string;
        urlToImage?: string;
        url: string;
        publishedAt?: string;
        source?: { name?: string };
        author?: string;
      }) => ({
        id: `news-${encodeURIComponent(a.url)}`,
        type: 'news' as const,
        title: a.title,
        description: a.description || undefined,
        // Strictly use urlToImage from NewsAPI; no random Unsplash fallbacks
        image: a.urlToImage || undefined,
        category: (category && category !== 'all' ? category : 'technology') as ContentItem['category'],
        url: a.url,
        publishedAt: a.publishedAt || undefined,
        source: a.source?.name || 'NewsAPI',
        metadata: {
          author: a.author || undefined,
          readingTime: '3 min read',
        },
      })
    );

    return NextResponse.json({
      items: articles,
      page,
      totalResults: data.totalResults || 0,
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
      { error: 'Failed to fetch news from NewsAPI' },
      { status: 500 }
    );
  }
}
