import { useState, useEffect } from 'react';
import type { UrlItem } from '../../services';
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
    <div className="w-full space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {formatDate(analytics.lastUpdated)}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total URLs Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Total URLs
          </h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.totalUrls}</p>
          <p className="text-xs text-gray-400 mt-2">Shortened URLs created</p>
        </div>

        {/* Total Clicks Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Total Clicks
          </h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.totalClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Redirects served</p>
        </div>

        {/* Average Clicks Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Average Clicks
          </h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.averageClicks}</p>
          <p className="text-xs text-gray-400 mt-2">Per URL average</p>
        </div>
      </div>

      {/* Trending URLs Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          🔥 Top Trending URLs
        </h3>

        {analytics.trending.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No trending URLs yet</h3>
            <p className="mt-1 text-sm text-gray-500">URLs will appear here as they get clicks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.trending.map((url, index) => (
              <div
                key={url.shortId}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : index === 1
                          ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                          : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                            : 'bg-gray-500'
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* URL Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Original URL
                      </p>
                      <p className="text-sm text-gray-900 truncate font-medium">{url.originalUrl}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {constants.backendUrl}/{url.shortId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clicks & Actions */}
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{url.clicks}</p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(url.shortId)}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-3 rounded-lg transition duration-200 text-sm"
                    title="Copy short URL"
                  >
                    Copy
                  </button>
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
