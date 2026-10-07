import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, UserPreferences } from '@/types/content';
import { loadFromStorage, saveToStorage } from '@/lib/utils';

const STORAGE_KEY = 'dashboard_preferences_v1';

export interface PreferencesState extends UserPreferences {
  isMobileMenuOpen: boolean;
}

const defaultPreferences: UserPreferences = {
  categories: ['technology', 'business', 'entertainment'],
  theme: 'dark',
  autoRefreshInterval: 0,
  feedOrder: [],
};

const initialState: PreferencesState = {
  ...defaultPreferences,
  ...loadFromStorage<Partial<UserPreferences>>(STORAGE_KEY, {}),
  isMobileMenuOpen: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<Category>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== category);
        }
      } else {
        state.categories.push(category);
      }
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      if (action.payload.length > 0) {
        state.categories = action.payload;
        saveToStorage(STORAGE_KEY, {
          categories: state.categories,
          theme: state.theme,
          autoRefreshInterval: state.autoRefreshInterval,
          feedOrder: state.feedOrder,
        });
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    setAutoRefreshInterval: (state, action: PayloadAction<number>) => {
      state.autoRefreshInterval = action.payload;
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    setFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.feedOrder = action.payload;
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    resetFeedOrder: (state) => {
      state.feedOrder = [];
      saveToStorage(STORAGE_KEY, {
        categories: state.categories,
        theme: state.theme,
        autoRefreshInterval: state.autoRefreshInterval,
        feedOrder: state.feedOrder,
      });
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    resetPreferences: (state) => {
      state.categories = defaultPreferences.categories;
      state.theme = defaultPreferences.theme;
      state.autoRefreshInterval = defaultPreferences.autoRefreshInterval;
      state.feedOrder = [];
      state.isMobileMenuOpen = false;
      saveToStorage(STORAGE_KEY, defaultPreferences);
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  setTheme,
  toggleTheme,
  setAutoRefreshInterval,
  setFeedOrder,
  resetFeedOrder,
  toggleMobileMenu,
  closeMobileMenu,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
