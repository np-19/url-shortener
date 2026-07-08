import type { ReactNode } from 'react';

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  description: string;
  accentClassName: string;
  iconBackgroundClassName: string;
  iconClassName: string;
  icon: ReactNode;
}

const AnalyticsStatCard = ({
  title,
  value,
  icon,
}: AnalyticsStatCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-silver-200 bg-white/80 p-4.5 transition-all duration-300 hover:border-silver-300 hover:shadow-xs">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-silver-150 bg-silver-50 text-silver-500 shadow-2xs">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-silver-450">{title}</p>
        <p className="text-xl font-extrabold tracking-tight text-silver-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default AnalyticsStatCard;