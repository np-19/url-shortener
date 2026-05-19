interface LoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

const LoadMoreButton = ({ loading, onClick }: LoadMoreButtonProps) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 rounded-full border border-silver-200 bg-white px-6 py-2.5 font-medium text-silver-800 shadow-sm transition-all duration-200 hover:bg-beige-50 disabled:opacity-50"
  >
    {loading ? (
      <>
        <svg className="h-4 w-4 animate-spin text-silver-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </>
    ) : (
      'Load More'
    )}
  </button>
);

export default LoadMoreButton;
