import type { TrendingUrl } from '../../hooks/useAnalytics';
import AnalyticsEmptyTrends from './AnalyticsEmptyTrends';
import AnalyticsTrendingItem from './AnalyticsTrendingItem';

interface AnalyticsTrendingPanelProps {
  trending: TrendingUrl[];
  onCopy: (shortId: string) => void;
}

const AnalyticsTrendingPanel = ({ trending, onCopy }: AnalyticsTrendingPanelProps) => (
  <div className="flex flex-col rounded-[2.5rem] border border-white bg-white/80 p-6 shadow-soft backdrop-blur-xl sm:p-8">
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-xl border border-orange-100/50 bg-linear-to-br from-orange-50 to-orange-100 p-2.5 shadow-sm">
        <span className="block text-lg leading-none text-orange-500">Hot</span>
      </div>
      <h3 className="text-2xl font-extrabold text-silver-900">Top Trending</h3>
    </div>

    {trending.length === 0 ? (
      <AnalyticsEmptyTrends />
    ) : (
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {trending.map((url, index) => (
          <AnalyticsTrendingItem key={url.shortId} url={url} index={index} onCopy={onCopy} />
        ))}
      </div>
    )}
  </div>
);

export default AnalyticsTrendingPanel;
