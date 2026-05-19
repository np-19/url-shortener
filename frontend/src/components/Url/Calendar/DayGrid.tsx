import { buildMonthDays, isPastDate, toDateValue, weekDays } from '../../../utils/calendar';

interface DayGridProps {
  monthAnchor: Date;
  value: string;
  onChange: (value: string) => void;
}

const DayGrid = ({ monthAnchor, value, onChange }: DayGridProps) => {
  const todayValue = toDateValue(new Date());
  const days = buildMonthDays(monthAnchor);

  return (
    <>
      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-silver-400 sm:text-[11px]">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dayNumber, index) => {
          if (!dayNumber) {
            return <div key={`empty-${index}`} className="h-8 rounded-lg sm:h-9" />;
          }

          const currentValue = toDateValue(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), dayNumber));
          const selected = currentValue === value;
          const disabled = isPastDate(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), dayNumber), todayValue);

          return (
            <button
              key={currentValue}
              type="button"
              disabled={disabled}
              onClick={() => onChange(currentValue)}
              className={`h-8 rounded-lg text-xs font-semibold transition-all sm:h-9 sm:text-sm ${
                selected
                  ? 'bg-forest-500 text-white shadow-soft'
                  : disabled
                    ? 'cursor-not-allowed bg-silver-50 text-silver-300'
                    : 'bg-beige-50 text-silver-700 hover:bg-forest-50 hover:text-forest-700'
              }`}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default DayGrid;
