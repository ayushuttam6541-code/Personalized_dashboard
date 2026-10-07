import { describe, it, expect, beforeEach } from 'vitest';
import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  FavoritesState,
} from './favoritesSlice';
import { ContentItem } from '@/types/content';

const mockItem: ContentItem = {
  id: 'test-item-1',
  type: 'news',
  title: 'Test Article',
  description: 'Test description content',
  image: 'https://example.com/test.jpg',
  category: 'technology',
  url: 'https://example.com',
  publishedAt: new Date().toISOString(),
  source: 'Test Source',
};

const mockItem2: ContentItem = {
  id: 'test-item-2',
  type: 'movie',
  title: 'Test Movie',
  description: 'Another test description',
  image: 'https://example.com/movie.jpg',
  category: 'entertainment',
  url: 'https://example.com/movie',
  publishedAt: new Date().toISOString(),
  source: 'TMDB',
};

describe('favoritesSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add an item to favorites', () => {
    const initial: FavoritesState = { items: [] };
    const state = favoritesReducer(initial, addFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('test-item-1');
  });

  it('should avoid adding duplicate favorites', () => {
    const initial: FavoritesState = { items: [mockItem] };
    const state = favoritesReducer(initial, addFavorite(mockItem));
    expect(state.items).toHaveLength(1);
  });

  it('should remove item by ID', () => {
    const initial: FavoritesState = { items: [mockItem, mockItem2] };
    const state = favoritesReducer(initial, removeFavorite('test-item-1'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('test-item-2');
  });

  it('should toggle favorite off if already present', () => {
    const initial: FavoritesState = { items: [mockItem] };
    const state = favoritesReducer(initial, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(0);
  });

  it('should toggle favorite on if not present', () => {
    const initial: FavoritesState = { items: [] };
    const state = favoritesReducer(initial, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('test-item-1');
  });

  it('should clear all favorites', () => {
    const initial: FavoritesState = { items: [mockItem, mockItem2] };
    const state = favoritesReducer(initial, clearFavorites());
    expect(state.items).toEqual([]);
  });
});
