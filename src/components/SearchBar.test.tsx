import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar component', () => {
  it('renders input with default placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    const input = screen.getByRole('searchbox', { name: /search dashboard content/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search articles, movies, or social posts...');
  });

  it('calls onChange handler when typing', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'quantum computing' } });
    expect(handleChange).toHaveBeenCalledWith('quantum computing');
  });

  it('renders clear button when value is present and clears on click', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="artificial intelligence" onChange={handleChange} />);

    const clearButton = screen.getByRole('button', { name: /clear search query/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
