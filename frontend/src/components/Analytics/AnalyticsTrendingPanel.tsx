import type { TrendingUrl } from '../../hooks/useAnalytics';
import AnalyticsEmptyTrends from './AnalyticsEmptyTrends';
import AnalyticsTrendingItem from './AnalyticsTrendingItem';

interface AnalyticsTrendingPanelProps {
  trending: TrendingUrl[];
  onCopy: (shortId: string) => void;
}

const AnalyticsTrendingPanel = ({ trending, onCopy }: AnalyticsTrendingPanelProps) => (
  <div className="rounded-2xl border border-silver-100 bg-white p-5">
    <div className="mb-3 flex items-center gap-2">
      <svg className="h-4 w-4 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      <h3 className="text-sm font-bold uppercase tracking-widest text-silver-500">Top Performing</h3>
    </div>

    {trending.length === 0 ? (
      <AnalyticsEmptyTrends />
    ) : (
      <div className="space-y-0.5">
        {trending.map((url, index) => (
          <AnalyticsTrendingItem key={url.shortId} url={url} index={index} onCopy={onCopy} />
        ))}
      </div>
    )}
  </div>
);

export default AnalyticsTrendingPanel;
