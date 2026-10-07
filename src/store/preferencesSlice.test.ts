import { describe, it, expect, beforeEach } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setCategories,
  setTheme,
  toggleTheme,
  setAutoRefreshInterval,
  setFeedOrder,
  resetFeedOrder,
  resetPreferences,
} from './preferencesSlice';
import { UserPreferences } from '@/types/content';

describe('preferencesSlice', () => {
  const initial: UserPreferences = {
    categories: ['technology', 'business', 'entertainment'],
    theme: 'dark',
    autoRefreshInterval: 0,
    feedOrder: [],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should toggle an unselected category on', () => {
    const state = preferencesReducer(initial, toggleCategory('sports'));
    expect(state.categories).toContain('sports');
  });

  it('should toggle a selected category off', () => {
    const state = preferencesReducer(initial, toggleCategory('technology'));
    expect(state.categories).not.toContain('technology');
  });

  it('should keep at least 1 category selected when trying to remove all', () => {
    const singleState: UserPreferences = {
      ...initial,
      categories: ['technology'],
    };
    const state = preferencesReducer(singleState, toggleCategory('technology'));
    expect(state.categories).toEqual(['technology']);
  });

  it('should set full list of categories', () => {
    const state = preferencesReducer(initial, setCategories(['science', 'health']));
    expect(state.categories).toEqual(['science', 'health']);
  });

  it('should set theme and toggle theme', () => {
    let state = preferencesReducer(initial, setTheme('light'));
    expect(state.theme).toBe('light');

    state = preferencesReducer(state, toggleTheme());
    expect(state.theme).toBe('dark');
  });

  it('should set auto-refresh interval', () => {
    const state = preferencesReducer(initial, setAutoRefreshInterval(60));
    expect(state.autoRefreshInterval).toBe(60);
  });

  it('should set and reset feed order', () => {
    let state = preferencesReducer(initial, setFeedOrder(['id-3', 'id-1', 'id-2']));
    expect(state.feedOrder).toEqual(['id-3', 'id-1', 'id-2']);

    state = preferencesReducer(state, resetFeedOrder());
    expect(state.feedOrder).toEqual([]);
  });

  it('should reset all preferences back to defaults', () => {
    const modifiedState: UserPreferences = {
      categories: ['health'],
      theme: 'light',
      autoRefreshInterval: 300,
      feedOrder: ['abc'],
    };

    const state = preferencesReducer(modifiedState, resetPreferences());
    expect(state.categories).toEqual(['technology', 'business', 'entertainment']);
    expect(state.theme).toBe('dark');
    expect(state.autoRefreshInterval).toBe(0);
    expect(state.feedOrder).toEqual([]);
  });
});
