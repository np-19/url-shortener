import { useCallback, useEffect, useRef } from 'react';

export const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delayMs: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: T) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delayMs);
    },
    [callback, cancel, delayMs]
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { debounced, cancel };
};
