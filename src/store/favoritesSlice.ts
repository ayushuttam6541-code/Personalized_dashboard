import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';
import { loadFromStorage, saveToStorage } from '@/lib/utils';

const STORAGE_KEY = 'dashboard_favorites_v1';

export interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = {
  items: loadFromStorage<ContentItem[]>(STORAGE_KEY, []),
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<ContentItem>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        saveToStorage(STORAGE_KEY, state.items);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToStorage(STORAGE_KEY, state.items);
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
      saveToStorage(STORAGE_KEY, state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveToStorage(STORAGE_KEY, state.items);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
