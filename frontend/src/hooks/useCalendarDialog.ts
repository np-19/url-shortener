import { useState } from 'react';
import { useOutsideClick } from './useOutsideClick';

export const useCalendarDialog = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarPanelRef = useOutsideClick<HTMLDivElement>(() => setIsCalendarOpen(false));

  return { calendarPanelRef, isCalendarOpen, setIsCalendarOpen };
};
