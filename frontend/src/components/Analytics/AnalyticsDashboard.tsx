import { Link } from 'react-router-dom';
import Button from '../Button';
import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useCopyToast } from '../../hooks/useCopyToast';
import AnalyticsHeader from './AnalyticsHeader';
import AnalyticsStatsGrid from './AnalyticsStatsGrid';
import AnalyticsTrendingPanel from './AnalyticsTrendingPanel';
import ClicksTimelineChart from './ClicksTimelineChart';
import ClicksBarChart from './ClicksBarChart';

const AnalyticsDashboard = () => {
  const { analytics, loading, error, refresh } = useAnalytics();
  const { toast, setToast, copyText } = useCopyToast();

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fadeIn px-4">
        <div className="mb-6 h-24 w-24 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center">
          <svg className="h-10 w-10 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-silver-900 mb-3 tracking-tight">No links created yet</h3>
        <p className="text-silver-500 max-w-md mx-auto mb-8 text-lg">
          You haven't shortened any URLs yet. Create your first short link to start tracking analytics!
        </p>
        <Link to="/">
          <Button className="px-8 py-3 text-lg font-bold shadow-md hover:shadow-lg">Create short link</Button>
        </Link>
      </div>
    );
  }

  const copyShortUrl = (shortId: string) => copyText(`${window.location.origin}/${shortId}`);

  return (
    <div className="w-full space-y-5 animate-fadeIn pb-8">
      <AnalyticsHeader lastUpdated={analytics.lastUpdated} onRefresh={refresh} />

      {/* Stats row */}
      <AnalyticsStatsGrid analytics={analytics} />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ClicksTimelineChart data={analytics.clicksTimeline} />
        <ClicksBarChart data={analytics.clicksDistribution} />
      </div>

      {/* Trending */}
      <AnalyticsTrendingPanel trending={analytics.trending} onCopy={copyShortUrl} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AnalyticsDashboard;
