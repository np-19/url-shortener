import LoadingBar from '../LoadingBar';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useCopyToast } from '../../hooks/useCopyToast';
import UrlListEmptyState from '../UrlList/UrlListEmptyState';
import AnalyticsHeader from './AnalyticsHeader';
import AnalyticsStatsGrid from './AnalyticsStatsGrid';
import AnalyticsTrendingPanel from './AnalyticsTrendingPanel';
import ClicksTimelineChart from './ClicksTimelineChart';
import ClicksBarChart from './ClicksBarChart';

const AnalyticsDashboard = () => {
  const { analytics, loading, isRefreshing, error, refresh } = useAnalytics();
  const { copyText } = useCopyToast();

  if (loading) {
    return <LoadingBar message="Loading analytics..." />;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>;
  }

  if (!analytics) {
    return null;
  }

  if (analytics.totalUrls === 0) {
    return (
      <UrlListEmptyState
        title="No URLs yet"
        description="Get started by creating your first shortened URL on the home page."
        showButton={true}
      />
    );
  }

  const copyShortUrl = (shortId: string) => copyText(`${window.location.origin}/${shortId}`);

  return (
    <div className="w-full space-y-5 animate-fadeIn pb-8">
      <AnalyticsHeader lastUpdated={analytics.lastUpdated} onRefresh={refresh} refreshing={isRefreshing} />

      {/* Stats row */}
      <AnalyticsStatsGrid analytics={analytics} />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ClicksTimelineChart data={analytics.clicksTimeline} />
        <ClicksBarChart data={analytics.clicksDistribution} />
      </div>

      {/* Trending */}
      <AnalyticsTrendingPanel trending={analytics.trending} onCopy={copyShortUrl} />
    </div>
  );
};

export default AnalyticsDashboard;
