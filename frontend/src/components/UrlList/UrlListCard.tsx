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
      className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
        expired
          ? 'border-apple-200 bg-white/60 opacity-80 shadow-xs'
          : 'border-silver-200 bg-white/80 shadow-xs hover:-translate-y-0.5 hover:shadow-sm hover:border-silver-300'
      }`}
    >
      <div className="flex flex-1 flex-col gap-4">
        {/* Header section */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-silver-400">
              <span className={`h-2 w-2 rounded-full ${expired ? 'bg-apple-400' : 'bg-forest-400'}`} />
              Short Link
            </div>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate font-mono text-base font-bold transition-colors ${
                expired ? 'pointer-events-none cursor-not-allowed text-silver-400' : 'text-forest-500 hover:text-forest-600'
              }`}
              onClick={(event) => expired && event.preventDefault()}
            >
              {constants.backendUrl + '/' + url.shortId}
            </a>
          </div>

          <button
            onClick={() => onCopy(shortUrl)}
            disabled={expired}
            className="shrink-0 rounded-xl border border-silver-200 bg-white p-2 text-silver-500 transition-all hover:bg-silver-50 hover:text-silver-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Copy URL"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Original URL preview */}
        <div className="break-all rounded-xl border border-silver-100 bg-silver-50/40 p-3.5 text-sm font-medium text-silver-600" title={url.originalUrl}>
          {url.originalUrl}
        </div>

        {/* Bottom meta row */}
        <div className="flex items-center justify-between gap-4 border-t border-silver-100 pt-3 text-silver-500 text-sm">
          {/* Clicks badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-forest-100 bg-forest-50/60 px-3 py-1 font-bold text-forest-600" title="Total Clicks">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>{url.clicks} clicks</span>
          </div>

          {/* Expiration date */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-silver-400">
            <span>Created {formatDate(url.createdAt)}</span>
            <span>•</span>
            {neverExpires ? (
              <span className="font-bold text-forest-500">Never Expires</span>
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