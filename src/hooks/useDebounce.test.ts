import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value change until delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: 'first', delay: 300 } }
    );

    expect(result.current).toBe('first');

    // Update the prop
    rerender({ val: 'second', delay: 300 });

    // Value should still be 'first' before time advances
    expect(result.current).toBe('first');

    // Advance by 150ms (halfway)
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('first');

    // Advance past remaining delay
    act(() => {
      vi.advanceTimersByTime(160);
    });
    expect(result.current).toBe('second');
  });

  it('should reset timer if value changes rapidly before delay', () => {
    const { result, rerender } = renderHook(
      ({ val }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } }
    );

    rerender({ val: 'ab' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ val: 'abc' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Still 'a' because 'abc' postponed the resolution
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(310);
    });
    expect(result.current).toBe('abc');
  });
});
