import LoadingBar from '../LoadingBar';
import Toast from '../Toast';
import { useCopyToast } from '../../hooks/useCopyToast';
import { usePaginatedUrls } from '../../hooks/usePaginatedUrls';
import type { UrlsResponse } from '../../services';
import UrlListEmptyState from './UrlListEmptyState';
import UrlListFooter from './UrlListFooter';
import UrlListGrid from './UrlListGrid';
import UrlListHeader from './UrlListHeader';

interface UrlListPageProps {
  queryKey: string;
  title: string;
  loadMessage: string;
  fetchUrls: (cursor?: string) => Promise<UrlsResponse>;
  emptyTitle: string;
  emptyDescription: string;
  showEmptyButton?: boolean;
}

const UrlListPage = ({ queryKey, title, loadMessage, fetchUrls, emptyTitle, emptyDescription, showEmptyButton = false }: UrlListPageProps) => {
  const { urls, loading, loadingMore, error, hasMore, refresh, loadMore } = usePaginatedUrls(queryKey, fetchUrls);
  const { toast, setToast, copyText } = useCopyToast();

  if (loading) {
    return <LoadingBar message={loadMessage} />;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>;
  }

  return (
    <div className="animate-fadeIn bg-transparent">
      <UrlListHeader title={title} onRefresh={refresh} />
      {urls.length === 0 ? (
        <UrlListEmptyState title={emptyTitle} description={emptyDescription} showButton={showEmptyButton} />
      ) : (
        <UrlListGrid urls={urls} onCopy={copyText} />
      )}
      <UrlListFooter loadedCount={urls.length} hasMore={hasMore} loadingMore={loadingMore} onLoadMore={loadMore} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UrlListPage;
