import { useState } from 'react';
import { urlService } from '../../services';
import Toast from '../Toast';

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
  const [url, setUrl] = useState('');
  const [expiresIn, setExpiresIn] = useState('7');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      const expiresAtSeconds = parseInt(expiresIn) * 24 * 60 * 60; // Convert days to seconds
      
      const data = await urlService.createUrl({
        originalUrl: url,
        expiresAt: expiresAtSeconds,
      });

      setShortUrl(urlService.getShortUrl(data.shortId));
      setUrl('');
      onUrlCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setToast({ message: 'Copied to clipboard!', type: 'success' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="font-bold text-gray-800 mb-4 sm:mb-6 text-center" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
        Shorten Your URL
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition text-sm sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="expires" className="block text-sm font-medium text-gray-700 mb-2">
            Expires in (days)
          </label>
          <select
            id="expires"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition text-sm sm:text-base"
          >
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">1 year</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Your shortened URL:</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm sm:text-base"
            />
            <button
              onClick={copyToClipboard}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      )}

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

export default UrlShortener;
