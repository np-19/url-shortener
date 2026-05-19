import type { AnalyticsData } from '../../hooks/useAnalytics';
import AnalyticsStatCard from './AnalyticsStatCard';
import { getAnalyticsStatConfig } from './analyticsStatConfig';

interface AnalyticsStatsGridProps {
  analytics: AnalyticsData;
}

const AnalyticsStatsGrid = ({ analytics }: AnalyticsStatsGridProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {getAnalyticsStatConfig(analytics).map((stat) => (
      <AnalyticsStatCard key={stat.title} {...stat} />
    ))}
  </div>
);

export default AnalyticsStatsGrid;
