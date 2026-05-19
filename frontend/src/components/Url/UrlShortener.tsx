import { useEffect, useRef, useState } from 'react';
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
  const [showExpiresOptions, setShowExpiresOptions] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const expiresMenuRef = useRef<HTMLDivElement | null>(null);

  const expiresOptions = [
    { value: '1', label: '1 day' },
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' },
  ];

  const selectedExpiresLabel = expiresOptions.find((option) => option.value === expiresIn)?.label ?? '7 days';

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (expiresMenuRef.current && !expiresMenuRef.current.contains(event.target as Node)) {
        setShowExpiresOptions(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowExpiresOptions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
    <div className="relative z-30 bg-white/80 backdrop-blur-xl rounded-[2.5rem] px-6 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8 lg:px-10 lg:pt-6 lg:pb-10 mx-auto overflow-hidden animate-scaleIn shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] border border-white">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-forest-200 via-forest-500 to-forest-200"></div>

      <h2 className="font-extrabold text-silver-900 mb-6 sm:mb-8 tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
        Shorten Your URL
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-silver-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full px-5 py-4 bg-beige-50 border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 placeholder-silver-400 text-sm sm:text-base font-medium shadow-inner"
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
            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-all duration-300 ${
              showCustomAlias
                ? 'bg-forest-500 shadow-[0_0_10px_rgba(53,144,77,0.25)]'
                : 'bg-forest-100 hover:bg-forest-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                showCustomAlias ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-semibold text-silver-700 cursor-pointer select-none">
            Custom Alias
          </label>
        </div>

        {showCustomAlias && (
          <div className="animate-fadeIn">
            <input
              type="text"
              id="customAlias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.trim())}
              placeholder="my-project, awesome-link, etc."
              className="w-full px-5 py-3 bg-beige-50 border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 placeholder-silver-400 text-sm sm:text-base font-medium shadow-inner"
            />
            <p className="text-xs text-silver-500 mt-2 ml-2 font-medium">Use alphanumeric characters and hyphens only (2-50 characters)</p>
          </div>
        )}

        <div ref={expiresMenuRef} className="relative">
          <label htmlFor="expires" className="block text-sm font-semibold text-silver-700 mb-2">
            Expires in (days)
          </label>
          <button
            type="button"
            onClick={() => setShowExpiresOptions((current) => !current)}
            aria-haspopup="listbox"
            aria-expanded={showExpiresOptions}
            className="flex w-full items-center justify-between gap-3 px-5 py-3 bg-white border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 font-medium text-sm sm:text-base shadow-sm hover:border-silver-300"
          >
            <span>{selectedExpiresLabel}</span>
            <svg className={`h-4 w-4 text-silver-500 transition-transform ${showExpiresOptions ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 8l4 4 4-4" />
            </svg>
          </button>

          {showExpiresOptions && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-silver-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.35)]">
              <div className="p-1">
                {expiresOptions.map((option) => {
                  const isActive = option.value === expiresIn;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setExpiresIn(option.value);
                        setShowExpiresOptions(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm sm:text-base transition-colors ${
                        isActive
                          ? 'bg-forest-500 text-white'
                          : 'text-silver-700 hover:bg-forest-50 hover:text-forest-700'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isActive && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Selected</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-apple-50 border border-apple-200 text-apple-600 px-5 py-4 rounded-2xl text-sm sm:text-base animate-fadeIn font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-forest-500 hover:bg-forest-600 text-white font-semibold py-3.5 sm:py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-4 shadow-soft hover:-translate-y-0.5"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Shortening...
            </span>
          ) : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-5 sm:p-6 bg-forest-50 border border-forest-200 rounded-2xl animate-fadeIn">
          <p className="text-xs sm:text-sm text-forest-700 mb-3 font-semibold">✨ Your shortened URL is ready:</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-4 py-3.5 bg-white border border-forest-200 rounded-xl text-sm sm:text-base text-forest-800 font-medium outline-none cursor-text shadow-sm"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 bg-white hover:bg-beige-50 border border-silver-200 text-silver-800 font-medium py-3.5 px-6 rounded-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
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
