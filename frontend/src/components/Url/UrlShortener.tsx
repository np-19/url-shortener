import { useState } from 'react';
import { urlService } from '../../services';
import Toast from '../Toast';
import { urlDataSchema } from '../../schemas/apiSchemas';

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [expiresIn, setExpiresIn] = useState('7');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    const expiresAtSeconds = Number.parseInt(expiresIn, 10) * 24 * 60 * 60;
    const candidateData = {
      originalUrl: url,
      expiresAt: expiresAtSeconds,
      ...(customAlias ? { customAlias } : {}),
    };

    const validatedData = urlDataSchema.safeParse(candidateData);
    if (!validatedData.success) {
      setError(validatedData.error.issues[0]?.message ?? 'Please enter valid URL details');
      return;
    }

    setLoading(true);

    try {
      const data = await urlService.createUrl(validatedData.data);

      setShortUrl(urlService.getShortUrl(data.shortId));
      setUrl('');
      setCustomAlias('');
      setShowCustomAlias(false);
      onUrlCreated();
    } catch (err: unknown) {
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowCustomAlias(!showCustomAlias);
              if (showCustomAlias) {
                setCustomAlias('');
              }
            }}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
              showCustomAlias
                ? 'bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                showCustomAlias ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Custom Alias
          </label>
        </div>

        {showCustomAlias && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <input
              type="text"
              id="customAlias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.trim())}
              placeholder="my-resume, awesome-project, etc."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base bg-blue-50/50"
            />
            <p className="text-xs text-gray-500 mt-2">Use alphanumeric characters and hyphens only (2-50 characters)</p>
          </div>
        )}

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
