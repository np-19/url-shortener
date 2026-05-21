import { useAnalytics } from '../../hooks/useAnalytics';
import { Link } from 'react-router-dom';

const HomeQuickStats = () => {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return <div className="animate-pulse rounded-[2rem] bg-white/50 h-64 w-full"></div>;
  }

  if (error || !analytics) {
    return null;
  }

  return (
    <div className="w-full rounded-[2rem] border border-white bg-white/60 p-6 shadow-soft backdrop-blur-md">
      <h3 className="text-xl font-bold text-silver-900 mb-6 flex items-center justify-between">
        Quick Stats
        <Link to="/analytics" className="text-sm font-semibold text-forest-500 hover:text-forest-600 transition-colors">
          View all &rarr;
        </Link>
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-silver-100">
          <p className="text-sm font-semibold text-silver-500 mb-1">Total Links</p>
          <p className="text-2xl font-black text-silver-900">{analytics.totalUrls.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-silver-100">
          <p className="text-sm font-semibold text-silver-500 mb-1">Total Clicks</p>
          <p className="text-2xl font-black text-forest-500">{analytics.totalClicks.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-silver-500 mb-3">Top Trending Links</p>
        {analytics.trending.length === 0 ? (
          <p className="text-sm text-silver-400 italic">No clicks yet.</p>
        ) : (
          <div className="space-y-3">
            {analytics.trending.slice(0, 3).map((item) => (
              <div key={item.shortId} className="flex items-center justify-between bg-white rounded-xl p-3 border border-silver-100">
                <div className="truncate pr-4 flex-1">
                  <p className="font-semibold text-silver-900 truncate">/{item.shortId}</p>
                  <p className="text-xs text-silver-400 truncate">{item.originalUrl}</p>
                </div>
                <div className="flex-shrink-0 bg-forest-50 text-forest-700 font-bold px-3 py-1 rounded-full text-sm">
                  {item.clicks.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeQuickStats;
