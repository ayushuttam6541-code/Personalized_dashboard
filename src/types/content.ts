export type ContentType = 'news' | 'movie' | 'social';

export type Category =
  | 'technology'
  | 'business'
  | 'entertainment'
  | 'sports'
  | 'science'
  | 'health';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  image?: string;
  category?: Category | string;
  url?: string;
  publishedAt?: string;
  source?: string;
  metadata?: {
    rating?: number;
    voteCount?: number;
    author?: string;
    handle?: string;
    likes?: number;
    retweets?: number;
    readingTime?: string;
    tag?: string;
  };
}

export interface UserPreferences {
  categories: Category[];
  theme: 'light' | 'dark';
  autoRefreshInterval: number; // seconds (0 = off)
  feedOrder: string[]; // persisted IDs order for drag and drop
}
