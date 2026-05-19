import { expiresOptions } from '../../../hooks/useUrlShortenerForm';
import { useExpirationDropdown } from '../../../hooks/useExpirationDropdown';
import ExpirationOption from './ExpirationOption';
import type { ExpirationValue } from './types';

interface ExpirationSelectProps {
  value: ExpirationValue;
  onChange: (value: ExpirationValue) => void;
  onNonCustomSelected: () => void;
}

const ExpirationSelect = ({ value, onChange, onNonCustomSelected }: ExpirationSelectProps) => {
  const { dropdownRef, isExpiresOpen, listRef, selectedExpiryLabel, setExpiresScroll, setIsExpiresOpen, thumbMetrics } =
    useExpirationDropdown(value);

  const selectOption = (optionValue: ExpirationValue) => {
    onChange(optionValue);
    setIsExpiresOpen(false);
    if (optionValue !== 'custom') {
      onNonCustomSelected();
    }
  };

  return (
    <div>
      <label htmlFor="expires" className="mb-2 block text-sm font-semibold text-silver-700">
        Expiration
      </label>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsExpiresOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-2xl border border-silver-200 bg-beige-50 px-5 py-3 text-left text-sm font-medium text-silver-900 shadow-inner outline-none transition-all hover:border-silver-300 focus:border-silver-400 focus:ring-4 focus:ring-silver-200 sm:text-base"
        >
          <span>{selectedExpiryLabel}</span>
          <svg className={`h-5 w-5 text-silver-400 transition-transform ${isExpiresOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpiresOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-silver-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
            <div className="relative">
              <div
                ref={listRef}
                className="year-scroll-area max-h-[240px] overflow-y-auto"
                onScroll={(event) => setExpiresScroll({
                  scrollTop: event.currentTarget.scrollTop,
                  clientHeight: event.currentTarget.clientHeight,
                  scrollHeight: event.currentTarget.scrollHeight,
                })}
              >
                {expiresOptions.map((option) => (
                  <ExpirationOption key={option.value} label={option.label} value={option.value} selected={value === option.value} onSelect={selectOption} />
                ))}
              </div>
              <div className="pointer-events-none absolute right-1 top-1 bottom-1 w-[11px] rounded-full bg-beige-200/90">
                <div
                  className="absolute left-0 right-0 rounded-full bg-forest-500 shadow-[0_0_0_1px_rgba(255,255,255,0.95),0_2px_6px_rgba(53,144,77,0.35)]"
                  style={{ height: `${thumbMetrics.thumbHeight}px`, transform: `translateY(${thumbMetrics.thumbOffset}px)` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpirationSelect;
