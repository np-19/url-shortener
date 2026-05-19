import type { ExpirationValue } from './types';

interface ExpirationOptionProps {
  label: string;
  selected: boolean;
  value: ExpirationValue;
  onSelect: (value: ExpirationValue) => void;
}

const ExpirationOption = ({ label, selected, value, onSelect }: ExpirationOptionProps) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors hover:bg-beige-50 sm:text-base ${
      selected ? 'bg-forest-50 font-semibold text-forest-700' : 'text-silver-700'
    }`}
  >
    <span>{label}</span>
    {selected && (
      <span className="text-forest-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )}
  </button>
);

export default ExpirationOption;
