interface UrlListHeaderProps {
  title: string;
  onRefresh: () => void;
  refreshing?: boolean;
}

const UrlListHeader = ({ title, onRefresh, refreshing = false }: UrlListHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-2xl font-black tracking-tight text-silver-900 sm:text-3xl">{title}</h2>
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className={`group flex items-center gap-1.5 rounded-full border border-silver-200 bg-white px-4 py-2 text-sm font-semibold text-silver-600 transition-all ${
        refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-beige-50 hover:shadow-sm'
      }`}
    >
      <svg
        className={`h-4 w-4 text-silver-400 transition-transform duration-500 ${
          refreshing ? 'animate-spin' : 'group-hover:rotate-180'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {refreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  </div>
);

export default UrlListHeader;
