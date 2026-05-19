import { useEffect, useMemo, useRef, useState } from 'react';
import { expiresOptions } from './useUrlShortenerForm';
import { getYearThumbMetrics } from '../utils/calendar';
import { useOutsideClick } from './useOutsideClick';
import type { ExpirationValue } from '../components/Url/UrlShortenerFields/types';

export const useExpirationDropdown = (expiresIn: ExpirationValue) => {
  const [isExpiresOpen, setIsExpiresOpen] = useState(false);
  const [expiresScroll, setExpiresScroll] = useState({ scrollTop: 0, clientHeight: 1, scrollHeight: 1 });
  const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsExpiresOpen(false));
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedExpiryLabel = useMemo(
    () => expiresOptions.find((option) => option.value === expiresIn)?.label ?? 'Select expiration',
    [expiresIn],
  );

  const thumbMetrics = useMemo(() => getYearThumbMetrics(expiresScroll), [expiresScroll]);

  useEffect(() => {
    if (!isExpiresOpen || !listRef.current) {
      return;
    }

    const list = listRef.current;
    setExpiresScroll({ scrollTop: list.scrollTop, clientHeight: list.clientHeight, scrollHeight: list.scrollHeight });
  }, [isExpiresOpen]);

  return {
    dropdownRef,
    expiresScroll,
    isExpiresOpen,
    listRef,
    selectedExpiryLabel,
    setExpiresScroll,
    setIsExpiresOpen,
    thumbMetrics,
  };
};
