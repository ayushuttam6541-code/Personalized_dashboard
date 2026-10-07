import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from '@/store/preferencesSlice';
import favoritesReducer from '@/store/favoritesSlice';
import { ContentCard } from './ContentCard';
import { ContentItem } from '@/types/content';

function renderWithStore(ui: React.ReactElement, initialFavorites: ContentItem[] = []) {
  const store = configureStore({
    reducer: {
      preferences: preferencesReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: { items: initialFavorites },
    },
  });

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

const mockNewsItem: ContentItem = {
  id: 'card-test-1',
  type: 'news',
  title: 'Next Generation AI Models Released',
  description: 'Researchers have unveiled cutting edge agentic systems.',
  image: 'https://media.newsapi.org/images/sample-news.jpg',
  category: 'technology',
  url: 'https://example.com/article',
  publishedAt: new Date().toISOString(),
  source: 'TechPulse',
  metadata: {
    author: 'Elena Vance',
    readingTime: '5 min read',
  },
};

const mockMovieItem: ContentItem = {
  id: 'card-test-2',
  type: 'movie',
  title: 'Inception Re-release',
  description: 'A thief who steals corporate secrets through dream-sharing technology.',
  image: 'https://image.tmdb.org/t/p/w500/sample-poster.jpg',
  category: 'entertainment',
  url: 'https://example.com/movie',
  publishedAt: new Date().toISOString(),
  source: 'TMDB',
  metadata: {
    rating: 8.8,
    voteCount: 35000,
  },
};

describe('ContentCard component', () => {
  it('renders news card details accurately', () => {
    renderWithStore(<ContentCard item={mockNewsItem} />);

    expect(screen.getByText('Next Generation AI Models Released')).toBeInTheDocument();
    expect(screen.getByText('Researchers have unveiled cutting edge agentic systems.')).toBeInTheDocument();
    expect(screen.getByText('TechPulse')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    expect(screen.getByText('By Elena Vance')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders movie card rating accurately', () => {
    renderWithStore(<ContentCard item={mockMovieItem} />);

    expect(screen.getByText('Inception Re-release')).toBeInTheDocument();
    expect(screen.getByText('8.8')).toBeInTheDocument();
    expect(screen.getByText('Movie')).toBeInTheDocument();
    expect(screen.getByText('entertainment')).toBeInTheDocument();
  });

  it('toggles favorite when heart button is clicked', () => {
    const { store } = renderWithStore(<ContentCard item={mockNewsItem} />);

    expect(store.getState().favorites.items).toHaveLength(0);

    const favButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favButton);

    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0].id).toBe('card-test-1');
  });
});
