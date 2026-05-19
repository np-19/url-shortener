import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { getYearThumbMetrics, yearItemHeight, yearListMaxHeight } from '../../../utils/calendar';

interface YearDropdownProps {
  label: string;
  selectedYear: number;
  years: number[];
  onYearChange: (year: number) => void;
}

const YearDropdown = ({ label, selectedYear, years, onYearChange }: YearDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollState, setScrollState] = useState({ scrollTop: 0, clientHeight: 1, scrollHeight: 1 });
  const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));
  const listRef = useRef<HTMLDivElement | null>(null);

  const { thumbHeight, thumbOffset } = useMemo(() => getYearThumbMetrics(scrollState), [scrollState]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const list = listRef.current;
    if (!list) {
      return;
    }

    const activeYearIndex = years.findIndex((year) => year === selectedYear);
    list.scrollTop = Math.max(0, activeYearIndex * yearItemHeight - yearItemHeight * 2);
    setScrollState({ scrollTop: list.scrollTop, clientHeight: list.clientHeight, scrollHeight: list.scrollHeight });
  }, [isOpen, selectedYear, years]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-silver-200 bg-beige-50 px-2 py-1.25 text-xs font-semibold text-silver-700 transition-colors hover:border-silver-300 sm:text-sm"
      >
        <span>{label}</span>
        <svg className={`h-4 w-4 text-silver-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 rounded-xl border border-silver-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
          <div className="relative px-1 py-1">
            <div
              ref={listRef}
              className="year-scroll-area max-h-[170px] overflow-y-auto"
              style={{ maxHeight: `${yearListMaxHeight}px` }}
              onScroll={(event) => {
                const target = event.currentTarget;
                setScrollState({
                  scrollTop: target.scrollTop,
                  clientHeight: target.clientHeight,
                  scrollHeight: target.scrollHeight,
                });
              }}
            >
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    onYearChange(year);
                    setIsOpen(false);
                  }}
                  className={`flex h-[34px] w-full items-center justify-between rounded-lg px-3 text-left text-xs transition-colors hover:bg-beige-50 sm:text-sm ${
                    selectedYear === year ? 'bg-forest-50 font-semibold text-forest-700' : 'text-silver-700'
                  }`}
                >
                  <span>{year}</span>
                  {selectedYear === year && (
                    <svg className="h-4 w-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute right-1 top-1 bottom-1 w-[11px] rounded-full bg-beige-200/90">
              <div
                className="absolute left-0 right-0 rounded-full bg-forest-500 shadow-[0_0_0_1px_rgba(255,255,255,0.95),0_2px_6px_rgba(53,144,77,0.35)]"
                style={{
                  height: `${thumbHeight}px`,
                  transform: `translateY(${thumbOffset}px)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearDropdown;
