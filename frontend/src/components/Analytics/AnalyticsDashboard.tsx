import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useCopyToast } from '../../hooks/useCopyToast';
import AnalyticsHeader from './AnalyticsHeader';
import AnalyticsStatsGrid from './AnalyticsStatsGrid';
import AnalyticsTrendingPanel from './AnalyticsTrendingPanel';

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

  const copyShortUrl = (shortId: string) => copyText(`${window.location.origin}/${shortId}`);

  return (
    <div className="w-full space-y-8 animate-fadeIn pb-12">
      <AnalyticsHeader lastUpdated={analytics.lastUpdated} onRefresh={refresh} />
      <AnalyticsStatsGrid analytics={analytics} />
      <AnalyticsTrendingPanel trending={analytics.trending} onCopy={copyShortUrl} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AnalyticsDashboard;
