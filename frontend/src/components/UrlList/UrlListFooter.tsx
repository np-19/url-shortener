import LoadMoreButton from './LoadMoreButton';

interface UrlListFooterProps {
  hasMore: boolean;
  loadedCount: number;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const UrlListFooter = ({ hasMore, loadedCount, loadingMore, onLoadMore }: UrlListFooterProps) => (
  <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
    <div className="inline-block rounded-full border border-silver-200 bg-white px-5 py-2.5 text-sm font-semibold text-silver-600 shadow-sm">
      Loaded URLs: <span className="ml-1 font-bold text-silver-900">{loadedCount}</span>
    </div>

    {hasMore && <LoadMoreButton loading={loadingMore} onClick={onLoadMore} />}
  </div>
);

export default UrlListFooter;
