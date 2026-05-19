export const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const yearWindow = 12;
export const yearItemHeight = 34;
export const yearVisibleCount = 5;
export const yearListMaxHeight = yearItemHeight * yearVisibleCount;

export const toDateValue = (date: Date) => date.toISOString().slice(0, 10);

export const getMonthLabel = (date: Date) => date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
export const getMonthEnd = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const buildMonthDays = (monthAnchor: Date) => {
  const firstDay = getMonthStart(monthAnchor).getDay();
  const lastDay = getMonthEnd(monthAnchor).getDate();

  return Array.from({ length: firstDay + lastDay }, (_, index) => {
    const dayNumber = index - firstDay + 1;
    return dayNumber > 0 ? dayNumber : null;
  });
};

export const buildYearRange = (currentYear = new Date().getFullYear(), window = yearWindow) =>
  Array.from({ length: window * 2 + 1 }, (_, index) => currentYear - window + index);

export const isPastDate = (candidate: Date, todayValue: string) => toDateValue(candidate) < todayValue;

export const getYearThumbMetrics = ({
  scrollTop,
  clientHeight,
  scrollHeight,
}: {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
}) => {
  if (!scrollHeight || scrollHeight <= clientHeight) {
    return { thumbHeight: clientHeight, thumbOffset: 0 };
  }

  const thumbHeight = Math.max(24, (clientHeight / scrollHeight) * clientHeight);
  const thumbOffset = ((clientHeight - thumbHeight) * scrollTop) / (scrollHeight - clientHeight);
  return { thumbHeight, thumbOffset };
};
