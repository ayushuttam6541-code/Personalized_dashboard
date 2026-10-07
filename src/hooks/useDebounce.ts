import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce any rapidly changing value.
 * Commonly used for search inputs to prevent excessive API calls.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default 350ms)
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
