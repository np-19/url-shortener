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
  description,
  accentClassName,
  iconBackgroundClassName,
  iconClassName,
  icon,
}: AnalyticsStatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white bg-white/80 p-6 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5">
      <div className={`absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 ${accentClassName}`}>
        <div className="h-24 w-24 translate-x-4 -translate-y-4">{icon}</div>
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className={`${iconBackgroundClassName} rounded-2xl border p-3 shadow-sm`}>
            <div className={iconClassName}>{icon}</div>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-silver-500">{title}</h3>
        </div>
        <p className="mb-1 text-5xl font-black tracking-tight text-silver-900">{value}</p>
        <p className="text-sm font-medium text-silver-400">{description}</p>
      </div>
    </div>
  );
};

export default AnalyticsStatCard;