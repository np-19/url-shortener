import { useState, useEffect } from 'react';

import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import constants from '../../configs/constants';

interface TrendingUrl {
  shortId: string;
  clicks: number;
  originalUrl: string;
}

interface AnalyticsData {
  trending: TrendingUrl[];
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
  lastUpdated: number;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${constants.backendUrl}/api/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (shortId: string) => {
    const shortUrl = `${constants.backendUrl}/${shortId}`;
    navigator.clipboard.writeText(shortUrl);
    setToast({ message: 'Copied to clipboard!', type: 'success' });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingBar message="Loading analytics..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Header with Refresh Button */}
      <div className="bg-transparent flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-silver-900 tracking-tight">Analytics</h2>
          <p className="text-sm text-silver-500 mt-1.5 flex items-center gap-2 font-medium">
            <svg className="w-4 h-4 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Last updated: {formatDate(analytics.lastUpdated)}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center justify-center gap-2 bg-white hover:bg-beige-50 border border-silver-200 text-silver-800 font-medium py-2.5 px-6 rounded-full transition-all duration-200 w-full sm:w-auto shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5 text-silver-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total URLs Card */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-soft border border-white transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-forest-50 p-2.5 rounded-xl shadow-sm border border-forest-100">
              <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <h3 className="text-sm font-bold text-silver-500 uppercase tracking-wider">
              Total URLs
            </h3>
          </div>
          <p className="text-4xl font-black text-silver-900 mb-1">{analytics.totalUrls}</p>
          <p className="text-xs font-semibold text-silver-400">Shortened URLs created</p>
        </div>

        {/* Total Clicks Card */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-soft border border-white transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 p-2.5 rounded-xl shadow-sm border border-blue-100">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            </div>
            <h3 className="text-sm font-bold text-silver-500 uppercase tracking-wider">
              Total Clicks
            </h3>
          </div>
          <p className="text-4xl font-black text-silver-900 mb-1">{analytics.totalClicks.toLocaleString()}</p>
          <p className="text-xs font-semibold text-silver-400">Redirects served</p>
        </div>

        {/* Average Clicks Card */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-soft border border-white transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-50 p-2.5 rounded-xl shadow-sm border border-purple-100">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-sm font-bold text-silver-500 uppercase tracking-wider">
              Average Clicks
            </h3>
          </div>
          <p className="text-4xl font-black text-silver-900 mb-1">{analytics.averageClicks}</p>
          <p className="text-xs font-semibold text-silver-400">Per URL average</p>
        </div>
      </div>

      {/* Trending URLs Section */}
      <div className="mt-8 relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] border border-white p-6 sm:p-8 lg:p-10">
        <h3 className="text-xl sm:text-2xl font-extrabold text-silver-900 mb-8 flex items-center gap-3">
          <span className="bg-orange-50 text-orange-500 p-2.5 rounded-xl shadow-sm border border-orange-100">🔥</span> 
          Top Trending URLs
        </h3>

        {analytics.trending.length === 0 ? (
          <div className="text-center py-16 bg-beige-50/50 rounded-3xl border border-silver-100">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-silver-100">
              <svg className="h-8 w-8 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-silver-900">No trending URLs yet</h3>
            <p className="mt-2 text-sm text-silver-500 font-medium">URLs will appear here as they get clicks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.trending.map((url, index) => (
              <div
                key={url.shortId}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-silver-200 hover:border-silver-300 hover:shadow-sm transition-all group"
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm ${
                      index === 0
                        ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        : index === 1
                          ? 'bg-silver-100 text-silver-600 border border-silver-200'
                          : index === 2
                            ? 'bg-orange-50 text-orange-600 border border-orange-200'
                            : 'bg-white text-silver-500 border border-silver-200'
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* URL Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={`${constants.backendUrl}/${url.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold font-mono text-forest-600 hover:text-forest-700 hover:underline truncate"
                    >
                      {constants.backendUrl}/{url.shortId}
                    </a>
                    <button
                      onClick={() => copyToClipboard(url.shortId)}
                      className="flex-shrink-0 text-silver-400 hover:text-silver-700 bg-silver-50 hover:bg-silver-100 border border-silver-100 hover:border-silver-300 p-1.5 rounded-lg transition-all"
                      title="Copy URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </div>
                  <div className="text-xs font-medium text-silver-500 truncate" title={url.originalUrl}>
                    {url.originalUrl}
                  </div>
                </div>

                {/* Clicks Badge */}
                <div className="flex-shrink-0">
                  <div className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-inner" title={`${url.clicks} total clicks`}>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                    {url.clicks}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AnalyticsDashboard;
