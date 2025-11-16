import { useState, useEffect } from 'react';
import { urlService } from '../../services';
import type { UrlItem } from '../../services';
import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import constants from '../../configs/constants';

const MyUrls = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const data = await urlService.getMyUrls();
      setUrls(data.urls);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My URLs</h2>
        <button
          onClick={fetchUrls}
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {urls.length === 0 ? (
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No URLs yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first shortened URL.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {urls.map((url) => (
                  <tr
                    key={url._id}
                    className={isExpired(url.expiresAt) ? 'bg-red-50' : ''}
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-60 truncate text-sm text-gray-900">
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate whitespace-nowrap">
                      <div className="text-sm text-gray-800 font-mono">
                        {constants.backendUrl + '/' + url.shortId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {url.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isExpired(url.expiresAt) ? (
                        <span className="text-red-600 font-semibold">Expired</span>
                      ) : (
                        <span className="text-gray-500">{formatDate(url.expiresAt)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => copyToClipboard(url.shortId)}
                        className="text-gray-700 hover:text-gray-900 font-medium"
                        disabled={isExpired(url.expiresAt)}
                      >
                        Copy
                      </button>
                      <a
                        href={urlService.getShortUrl(url.shortId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-4 font-medium ${
                          isExpired(url.expiresAt)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                        onClick={(e) => isExpired(url.expiresAt) && e.preventDefault()}
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {urls.map((url) => (
              <div
                key={url._id}
                className={`p-4 rounded-lg border ${
                  isExpired(url.expiresAt)
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
                } shadow-sm`}
              >
                <div className="space-y-3">
                  {/* Original URL */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Original URL
                    </p>
                    <p className="text-sm text-gray-900 break-all">{url.originalUrl}</p>
                  </div>

                  {/* Short URL */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Short URL
                    </p>
                    <p className="text-sm text-gray-800 font-mono break-all">
                      {constants.backendUrl + '/' + url.shortId}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {url.clicks}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-700">{formatDate(url.createdAt)}</p>
                    </div>
                  </div>

                  {/* Expiry */}
                  <div>
                    <p className="text-xs text-gray-500">Expires</p>
                    {isExpired(url.expiresAt) ? (
                      <span className="text-sm text-red-600 font-semibold">Expired</span>
                    ) : (
                      <span className="text-sm text-gray-700">{formatDate(url.expiresAt)}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => copyToClipboard(url.shortId)}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isExpired(url.expiresAt)}
                    >
                      Copy
                    </button>
                    <a
                      href={urlService.getShortUrl(url.shortId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center font-medium py-2 px-4 rounded-lg border transition ${
                        isExpired(url.expiresAt)
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={(e) => isExpired(url.expiresAt) && e.preventDefault()}
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Total URLs: {urls.length}
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
