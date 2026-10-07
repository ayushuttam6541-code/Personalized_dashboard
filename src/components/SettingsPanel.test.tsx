import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from '@/store/preferencesSlice';
import favoritesReducer from '@/store/favoritesSlice';
import { SettingsPanel } from './SettingsPanel';

function renderWithStore() {
  const store = configureStore({
    reducer: {
      preferences: preferencesReducer,
      favorites: favoritesReducer,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <SettingsPanel />
      </Provider>
    ),
    store,
  };
}

describe('SettingsPanel component', () => {
  it('renders all topic categories and allows selection toggling', () => {
    const { store } = renderWithStore();

    expect(screen.getByText('Ayush Raj')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();

    const sportsButton = screen.getByRole('button', { name: /sports/i });
    fireEvent.click(sportsButton);

    expect(store.getState().preferences.categories).toContain('sports');
  });

  it('allows theme switching', () => {
    const { store } = renderWithStore();

    const lightModeBtn = screen.getByRole('button', { name: /light mode/i });
    fireEvent.click(lightModeBtn);

    expect(store.getState().preferences.theme).toBe('light');
  });

  it('resets all preferences when Reset button is clicked', () => {
    const { store } = renderWithStore();

    const resetBtn = screen.getByRole('button', { name: /reset all preferences/i });
    fireEvent.click(resetBtn);

    expect(store.getState().preferences.categories).toEqual([
      'technology',
      'business',
      'entertainment',
    ]);
  });
});
