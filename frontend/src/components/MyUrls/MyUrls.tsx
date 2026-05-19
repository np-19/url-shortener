import { useCallback } from 'react';
import urlService from '../../services';
import UrlListPage from '../UrlList/UrlListPage';

const MyUrls = () => {
  const fetchUrls = useCallback((cursor?: string) => urlService.getMyUrls(cursor), []);

  return (
    <UrlListPage
      title="My URLs"
      loadMessage="Loading your URLs..."
      fetchUrls={fetchUrls}
      emptyTitle="No URLs yet"
      emptyDescription="Get started by creating your first shortened URL on the home page."
    />
  );
};

export default MyUrls;
