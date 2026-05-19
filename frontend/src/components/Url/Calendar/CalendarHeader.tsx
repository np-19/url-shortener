import YearDropdown from './YearDropdown';

interface CalendarHeaderProps {
  monthLabel: string;
  selectedYear: number;
  years: number[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: number) => void;
}

const CalendarHeader = ({
  monthLabel,
  selectedYear,
  years,
  onPreviousMonth,
  onNextMonth,
  onYearChange,
}: CalendarHeaderProps) => {
  return (
    <div className="mb-2.5 flex items-start justify-between gap-1.5">
      <button
        type="button"
        onClick={onPreviousMonth}
        className="rounded-lg border border-silver-200 bg-beige-50 px-2 py-1.25 text-xs font-semibold text-silver-700 transition-colors hover:bg-silver-50 sm:text-sm"
      >
        ←
      </button>
      <div className="flex flex-1 flex-col items-center gap-1">
        <YearDropdown
          label={monthLabel}
          selectedYear={selectedYear}
          years={years}
          onYearChange={onYearChange}
        />
      </div>
      <button
        type="button"
        onClick={onNextMonth}
        className="rounded-lg border border-silver-200 bg-beige-50 px-2 py-1.25 text-xs font-semibold text-silver-700 transition-colors hover:bg-silver-50 sm:text-sm"
      >
        →
      </button>
    </div>
  );
};

export default CalendarHeader;
