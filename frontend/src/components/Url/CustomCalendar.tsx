import { useMemo, useState } from 'react';
import CalendarFooter from './Calendar/CalendarFooter';
import CalendarHeader from './Calendar/CalendarHeader';
import DayGrid from './Calendar/DayGrid';
import { buildYearRange, getMonthLabel } from '../../utils/calendar';

interface CustomCalendarProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomCalendar = ({ value, onChange }: CustomCalendarProps) => {
  const initialMonth = value ? new Date(`${value}T00:00:00`) : new Date();
  const [monthAnchor, setMonthAnchor] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const monthLabel = getMonthLabel(monthAnchor);
  const years = useMemo(() => buildYearRange(), []);

  const goToPreviousMonth = () => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() - 1, 1));
  const goToNextMonth = () => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1));

  return (
    <div className="rounded-2xl border border-silver-200 bg-white p-2.5 shadow-sm sm:p-3">
      <CalendarHeader
        monthLabel={monthLabel}
        selectedYear={monthAnchor.getFullYear()}
        years={years}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onYearChange={(year) => setMonthAnchor(new Date(year, monthAnchor.getMonth(), 1))}
      />
      <DayGrid monthAnchor={monthAnchor} value={value} onChange={onChange} />
      <CalendarFooter value={value} selectedDate={selectedDate} onClear={() => onChange('')} />
    </div>
  );
};

export default CustomCalendar;
