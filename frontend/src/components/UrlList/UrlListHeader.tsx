interface UrlListHeaderProps {
  title: string;
  onRefresh: () => void;
}

const UrlListHeader = ({ title, onRefresh }: UrlListHeaderProps) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl font-extrabold tracking-tight text-silver-900 sm:text-3xl">{title}</h2>
    <button
      onClick={onRefresh}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-silver-200 bg-white px-6 py-2.5 font-medium text-silver-800 shadow-sm transition-all duration-200 hover:bg-beige-50 hover:shadow sm:w-auto"
    >
      <svg className="h-5 w-5 text-silver-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh
    </button>
  </div>
);

export default UrlListHeader;
