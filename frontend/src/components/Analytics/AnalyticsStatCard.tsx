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
  iconBackgroundClassName,
  iconClassName,
  icon,
}: AnalyticsStatCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-silver-100 bg-white p-4 transition-all duration-200 hover:shadow-md">
      <div className={`${iconBackgroundClassName} shrink-0 rounded-xl border p-2.5 shadow-sm`}>
        <div className={iconClassName}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-silver-400">{title}</p>
        <p className="text-2xl font-black tracking-tight text-silver-900">{value}</p>
      </div>
    </div>
  );
};

export default AnalyticsStatCard;