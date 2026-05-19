interface UrlShortenerResultProps {
  shortUrl: string;
  onCopy: () => void;
}

const UrlShortenerResult = ({ shortUrl, onCopy }: UrlShortenerResultProps) => {
  return (
    <div className="mt-6 animate-fadeIn rounded-2xl border border-forest-200 bg-forest-50 p-5 sm:p-6">
      <p className="mb-3 text-xs font-semibold text-forest-700 sm:text-sm">✨ Your shortened URL is ready:</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={shortUrl}
          readOnly
          className="flex-1 cursor-text rounded-xl border border-forest-200 bg-white px-4 py-3.5 text-sm font-medium text-forest-800 shadow-sm outline-none sm:text-base"
        />
        <button
          onClick={onCopy}
          className="flex items-center justify-center gap-2 rounded-xl border border-silver-200 bg-white px-6 py-3.5 text-sm font-medium text-silver-800 shadow-sm transition-all duration-200 hover:bg-beige-50 hover:shadow sm:text-base"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
      </div>
    </div>
  );
};

export default UrlShortenerResult;