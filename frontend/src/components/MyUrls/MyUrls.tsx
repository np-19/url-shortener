import { useState, useEffect } from 'react';
import { urlService } from '../../services';
import type { UrlItem } from '../../services';
import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import constants from '../../configs/constants';

const MyUrls = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchUrls = async (reset: boolean = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const currentCursor = reset ? undefined : nextCursor ?? undefined;
      const data = await urlService.getMyUrls(currentCursor);
      
      if (reset) {
        setUrls(data.urls);
      } else {
        setUrls(prev => [...prev, ...data.urls]);
      }
      
      setNextCursor(data.nextCursor ?? null);
      setHasMore(data.hasMore ?? false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUrls(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = (shortId: string) => {
    const shortUrl = urlService.getShortUrl(shortId);
    navigator.clipboard.writeText(shortUrl);
    setToast({ message: 'Copied to clipboard!', type: 'success' });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <LoadingBar message="Loading your URLs..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-transparent animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-silver-900 tracking-tight">My URLs</h2>
        <button
          onClick={() => fetchUrls(true)}
          className="flex items-center justify-center gap-2 bg-white hover:bg-beige-50 border border-silver-200 text-silver-800 font-medium py-2.5 px-6 rounded-full transition-all duration-200 w-full sm:w-auto shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5 text-silver-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh
        </button>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-soft">
          <div className="bg-beige-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-silver-200 shadow-inner">
            <svg className="h-10 w-10 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-silver-900">No URLs yet</h3>
          <p className="mt-2 text-base text-silver-500 max-w-sm mx-auto">
            Get started by creating your first shortened URL on the home page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urls.map((url) => (
            <div
              key={url._id}
              className={`p-4 sm:p-5 rounded-3xl border bg-white/80 backdrop-blur-md flex flex-col ${
                isExpired(url.expiresAt)
                  ? 'border-apple-200 shadow-sm opacity-80'
                  : 'border-white shadow-[0_10px_40px_-10px_rgba(107,114,128,0.1)] hover:-translate-y-1'
              } transition-all duration-300 group relative overflow-hidden`}
            >
              {isExpired(url.expiresAt) && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-apple-50 transform rotate-45 translate-x-8 -translate-y-8 z-0"></div>
              )}
              <div className="space-y-4 relative z-10 flex-1 flex flex-col">
                {/* Original URL */}
                <div>
                  <p className="text-xs font-bold text-silver-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    Original URL
                  </p>
                  <p className="text-sm text-silver-700 font-medium break-all bg-beige-50 p-3 rounded-xl border border-silver-100">{url.originalUrl}</p>
                </div>

                {/* Short URL */}
                <div>
                  <p className="text-xs font-bold text-silver-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    Short URL
                  </p>
                  <div className="flex items-stretch gap-2">
                    <a
                      href={urlService.getShortUrl(url.shortId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-sm font-mono break-all p-3 rounded-xl border font-semibold shadow-inner transition-colors flex items-center ${
                        isExpired(url.expiresAt) 
                          ? 'bg-beige-50 border-silver-200 text-silver-400 cursor-not-allowed'
                          : 'bg-forest-50 border-forest-100 text-forest-600 hover:bg-forest-100 hover:border-forest-200'
                      }`}
                      onClick={(e) => isExpired(url.expiresAt) && e.preventDefault()}
                    >
                      {constants.backendUrl + '/' + url.shortId}
                    </a>
                    <button
                      onClick={() => copyToClipboard(url.shortId)}
                      disabled={isExpired(url.expiresAt)}
                      className="flex-shrink-0 flex items-center justify-center w-12 bg-white hover:bg-beige-50 border border-silver-200 text-silver-500 hover:text-silver-800 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Copy URL"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </div>
                </div>

                {/* Spacer to push actions to bottom */}
                <div className="flex-1"></div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-silver-100">
                  <div>
                    <p className="text-xs font-semibold text-silver-400 mb-1">Clicks</p>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {url.clicks}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-silver-400 mb-1">Created</p>
                    <p className="text-sm text-silver-600 font-medium">{formatDate(url.createdAt)}</p>
                  </div>
                </div>

                {/* Expiry */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-silver-400 mb-1">Expires</p>
                  {isExpired(url.expiresAt) ? (
                    <span className="text-xs font-bold text-apple-600 bg-apple-50 px-3 py-1 rounded-full border border-apple-200 inline-block">Expired on {formatDate(url.expiresAt)}</span>
                  ) : (
                    <span className="text-sm text-silver-600 font-medium">{formatDate(url.expiresAt)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-silver-600 font-semibold bg-white border border-silver-200 inline-block px-5 py-2.5 rounded-full shadow-sm">
          Loaded URLs: <span className="text-silver-900 ml-1 font-bold">{urls.length}</span>
        </div>

        {hasMore && (
          <button
            onClick={() => fetchUrls(false)}
            disabled={loadingMore}
            className="flex items-center gap-2 bg-white hover:bg-beige-50 border border-silver-200 text-silver-800 font-medium py-2.5 px-6 rounded-full transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin h-4 w-4 text-silver-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
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

export default MyUrls;
