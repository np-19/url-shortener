import constants from '../../configs/constants';
import urlService, { type UrlItem } from '../../services';
import { formatDate, isExpired, isNeverExpires } from '../../utils/url';

interface UrlListCardProps {
  url: UrlItem;
  onCopy: (shortUrl: string) => void;
}

const UrlListCard = ({ url, onCopy }: UrlListCardProps) => {
  const expired = isExpired(url.expiresAt);
  const neverExpires = isNeverExpires(url.expiresAt);
  const shortUrl = urlService.getShortUrl(url.shortId);

  return (
    <div
      className={`relative flex flex-col gap-4 overflow-hidden rounded-3xl border bg-white/80 p-4 backdrop-blur-md transition-all duration-300 group ${
        expired
          ? 'border-apple-200 shadow-sm opacity-80'
          : 'border-white shadow-[0_10px_40px_-10px_rgba(107,114,128,0.1)] hover:-translate-y-1'
      }`}
    >
      {expired && <div className="absolute right-0 top-0 z-0 h-16 w-16 translate-x-8 -translate-y-8 rotate-45 bg-apple-50" />}

      <div className="relative z-10 flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-silver-400">
              <span className={`h-2.5 w-2.5 rounded-full ${expired ? 'bg-apple-400' : 'bg-forest-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'}`} />
              Short URL
            </p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate font-mono text-sm font-bold transition-colors ${
                expired ? 'pointer-events-none cursor-not-allowed text-silver-400' : 'text-forest-600 hover:text-forest-700 hover:underline'
              }`}
              onClick={(event) => expired && event.preventDefault()}
            >
              {constants.backendUrl + '/' + url.shortId}
            </a>
          </div>

          <button
            onClick={() => onCopy(shortUrl)}
            disabled={expired}
            className="shrink-0 rounded-xl border border-silver-100 bg-silver-50 p-2 text-silver-400 transition-all hover:border-silver-300 hover:bg-silver-100 hover:text-silver-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Copy URL"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div className="break-all rounded-2xl border border-silver-100 bg-beige-50 p-3 text-sm font-medium text-silver-700" title={url.originalUrl}>
          {url.originalUrl}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-silver-100 pt-3 text-silver-500">
          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-blue-600" title="Total Clicks">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            {url.clicks}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span title="Created At">{formatDate(url.createdAt)}</span>
            <span className="text-silver-300">•</span>
            {neverExpires ? (
              <span className="font-bold text-forest-600">Never</span>
            ) : expired ? (
              <span className="font-bold text-apple-500">Expired</span>
            ) : (
              <span title="Expires At">Exp: {formatDate(url.expiresAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlListCard;