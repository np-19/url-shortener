interface UrlShortenerResultProps {
  shortUrl: string;
  onCopy: () => void;
}

const UrlShortenerResult = ({ shortUrl, onCopy }: UrlShortenerResultProps) => {
  return (
    <div className="mt-8 animate-fadeIn text-left">
      <div className="border-t border-silver-100 my-6" />

      <div className="space-y-3">
        <label htmlFor="resultUrl" className="text-sm font-bold text-silver-700 block ml-1">
          Here is your shortened link:
        </label>
        
        <div className="flex items-stretch gap-2.5">
          <div className="flex-1 relative flex items-center">
            <input
              id="resultUrl"
              type="text"
              value={shortUrl}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full rounded-xl border border-silver-200 bg-white px-4 py-3.5 font-mono text-sm font-bold text-forest-600 outline-none transition-all focus:border-forest-400 select-all pr-12 shadow-2xs"
            />
            <div className="absolute right-4 text-forest-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>

          <button
            onClick={onCopy}
            className="flex items-center justify-center gap-2 rounded-xl bg-forest-500 hover:bg-forest-600 px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 cursor-pointer border border-forest-600/10 shadow-xs active:scale-98"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlShortenerResult;