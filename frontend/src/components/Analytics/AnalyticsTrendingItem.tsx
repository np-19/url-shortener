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
      ? 'bg-forest-500 text-white'
      : index === 1
        ? 'bg-forest-100 text-forest-600'
        : 'bg-silver-100 text-silver-500';

  return (
    <div className="group flex items-center gap-3 rounded-xl py-2.5 px-3 transition-all hover:bg-beige-50">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${badgeClassName}`}>
        {index + 1}
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
        <div className="truncate text-[11px] font-medium text-silver-400" title={url.originalUrl}>
          {url.originalUrl}
        </div>
      </div>

      <span className="text-sm font-black text-forest-500 tabular-nums">{url.clicks}</span>

      <button
        onClick={() => onCopy(url.shortId)}
        className="shrink-0 rounded-lg p-1.5 text-silver-300 transition-all hover:bg-silver-100 hover:text-silver-600"
        title="Copy URL"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

export default AnalyticsTrendingItem;