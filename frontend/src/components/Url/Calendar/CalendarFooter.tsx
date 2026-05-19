interface CalendarFooterProps {
  value: string;
  selectedDate: Date | null;
  onClear: () => void;
}

const CalendarFooter = ({ value, selectedDate, onClear }: CalendarFooterProps) => {
  return (
    <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-medium text-silver-500 sm:text-[11px]">
      <span>{selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : 'Pick a future date'}</span>
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-silver-200 px-2 py-0.5 text-silver-600 transition-colors hover:bg-silver-50"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default CalendarFooter;
