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
    <div className="w-full space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-silver-900 to-silver-600 tracking-tight mb-2">
            Analytics Overview
          </h2>
          <p className="text-sm text-silver-500 flex items-center gap-2 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-500"></span>
            </span>
            Live data • Last updated: {formatDate(analytics.lastUpdated)}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="group flex items-center justify-center gap-2 bg-white hover:bg-beige-50 border border-silver-200 text-silver-800 font-semibold py-2.5 px-6 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 text-silver-500 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total URLs */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-soft border border-white hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-forest-500 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-forest-50 to-forest-100 p-3 rounded-2xl shadow-sm border border-forest-100/50">
                <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-silver-500 uppercase tracking-widest">Total Links</h3>
            </div>
            <p className="text-5xl font-black text-silver-900 mb-1 tracking-tight">{analytics.totalUrls}</p>
            <p className="text-sm font-medium text-silver-400">Shortened URLs created</p>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-soft border border-white hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-500 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-2xl shadow-sm border border-blue-100/50">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-silver-500 uppercase tracking-widest">Total Clicks</h3>
            </div>
            <p className="text-5xl font-black text-silver-900 mb-1 tracking-tight">{analytics.totalClicks.toLocaleString()}</p>
            <p className="text-sm font-medium text-silver-400">Total redirects served</p>
          </div>
        </div>

        {/* Average Clicks */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-soft border border-white hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-purple-500 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-2xl shadow-sm border border-purple-100/50">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-silver-500 uppercase tracking-widest">Avg Clicks</h3>
            </div>
            <p className="text-5xl font-black text-silver-900 mb-1 tracking-tight">{analytics.averageClicks}</p>
            <p className="text-sm font-medium text-silver-400">Average per URL</p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Top Links List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2.5 rounded-xl shadow-sm border border-orange-100/50">
              <span className="text-orange-500 text-lg leading-none block">🔥</span>
            </div>
            <h3 className="text-2xl font-extrabold text-silver-900">Top Trending</h3>
          </div>

          {analytics.trending.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-beige-50/50 rounded-3xl border border-dashed border-silver-200 p-6 text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm border border-silver-100">
                <svg className="h-6 w-6 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-silver-900 mb-1">No trends yet</h3>
              <p className="text-xs text-silver-500 font-medium">URLs will appear as they get clicks</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {analytics.trending.map((url, index) => (
                <div
                  key={url.shortId}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-silver-100 hover:border-silver-300 hover:shadow-sm transition-all group"
                >
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 border border-yellow-200/50'
                        : index === 1
                          ? 'bg-gradient-to-br from-silver-100 to-silver-200 text-silver-600 border border-silver-300/50'
                          : index === 2
                            ? 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border border-orange-200/50'
                            : 'bg-silver-50 text-silver-500 border border-silver-200/50'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* URL Info */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={`${constants.backendUrl}/${url.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold font-mono text-silver-800 group-hover:text-forest-600 transition-colors truncate block"
                    >
                      /{url.shortId}
                    </a>
                    <div className="text-xs font-medium text-silver-400 truncate mt-0.5" title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                  </div>

                  {/* Clicks */}
                  <div className="flex-col items-end hidden sm:flex">
                    <span className="text-sm font-black text-blue-600">{url.clicks}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-silver-400">Clicks</span>
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(url.shortId)}
                    className="flex-shrink-0 text-silver-400 hover:text-silver-700 bg-silver-50 hover:bg-silver-100 border border-silver-100 hover:border-silver-300 p-2 rounded-xl transition-all"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
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
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
