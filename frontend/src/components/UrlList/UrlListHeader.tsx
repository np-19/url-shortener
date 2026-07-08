interface UrlListHeaderProps {
  title: string;
  onRefresh: () => void;
  refreshing?: boolean;
}

const UrlListHeader = ({ title, onRefresh, refreshing = false }: UrlListHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-xl font-bold tracking-tight text-silver-900 sm:text-2xl">{title}</h2>
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className={`group flex items-center gap-1.5 rounded-xl border border-silver-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-silver-600 transition-all backdrop-blur-xs ${
        refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-silver-50 hover:border-silver-300'
      }`}
    >
      <svg
        className={`h-3.5 w-3.5 text-silver-400 transition-transform duration-500 ${
          refreshing ? 'animate-spin' : 'group-hover:rotate-180'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  </div>
);

export default UrlListHeader;
