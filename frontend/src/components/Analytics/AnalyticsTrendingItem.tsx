import constants from '../../configs/constants';
import type { TrendingUrl } from '../../hooks/useAnalytics';

interface AnalyticsTrendingItemProps {
  url: TrendingUrl;
  index: number;
  onCopy: (shortId: string) => void;
}

const AnalyticsTrendingItem = ({ url, index, onCopy }: AnalyticsTrendingItemProps) => {
  const badgeClassName =
    index === 0
      ? 'bg-linear-to-br from-yellow-50 to-yellow-100 text-yellow-600 border border-yellow-200/50'
      : index === 1
        ? 'bg-linear-to-br from-silver-100 to-silver-200 text-silver-600 border border-silver-300/50'
        : index === 2
          ? 'bg-linear-to-br from-orange-50 to-orange-100 text-orange-600 border border-orange-200/50'
          : 'bg-silver-50 text-silver-500 border border-silver-200/50';

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-silver-100 bg-white p-3 transition-all hover:border-silver-300 hover:shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-sm ${badgeClassName}`}>
        #{index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <a
          href={`${constants.backendUrl}/${url.shortId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-mono text-sm font-bold text-silver-800 transition-colors group-hover:text-forest-600"
        >
          /{url.shortId}
        </a>
        <div className="mt-0.5 truncate text-xs font-medium text-silver-400" title={url.originalUrl}>
          {url.originalUrl}
        </div>
      </div>

      <div className="hidden flex-col items-end sm:flex">
        <span className="text-sm font-black text-blue-600">{url.clicks}</span>
        <span className="text-[10px] uppercase tracking-wider text-silver-400">Clicks</span>
      </div>

      <button
        onClick={() => onCopy(url.shortId)}
        className="shrink-0 rounded-xl border border-silver-100 bg-silver-50 p-2 text-silver-400 transition-all hover:border-silver-300 hover:bg-silver-100 hover:text-silver-700"
        title="Copy URL"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

export default AnalyticsTrendingItem;