'use client';

import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector, Provider } from 'react-redux';
import preferencesReducer from './preferencesSlice';
import favoritesReducer from './favoritesSlice';
import { contentApi } from './api';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function ThemeSync({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return React.createElement(React.Fragment, null, children);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const ProviderComponent = Provider as unknown as React.ComponentType<{ store: typeof store }>;
  return React.createElement(
    ProviderComponent,
    { store },
    React.createElement(ThemeSync, null, children)
  );
}
