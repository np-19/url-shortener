import { formatDate } from '../../utils/url';

interface AnalyticsHeaderProps {
  lastUpdated: number;
  onRefresh: () => void;
}

const AnalyticsHeader = ({ lastUpdated, onRefresh }: AnalyticsHeaderProps) => (
  <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="mb-2 bg-clip-text text-3xl font-black tracking-tight text-transparent bg-linear-to-r from-silver-900 to-silver-600 sm:text-4xl">
        Analytics Overview
      </h2>
      <p className="flex items-center gap-2 text-sm font-medium text-silver-500">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-forest-500" />
        </span>
        Live data - Last updated: {formatDate(lastUpdated, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>

    <button
      onClick={onRefresh}
      className="group flex w-full items-center justify-center gap-2 rounded-full border border-silver-200 bg-white px-6 py-2.5 font-semibold text-silver-800 shadow-sm transition-all duration-300 hover:bg-beige-50 hover:shadow-md sm:w-auto"
    >
      <svg className="h-5 w-5 text-silver-500 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh Data
    </button>
  </div>
);

export default AnalyticsHeader;
