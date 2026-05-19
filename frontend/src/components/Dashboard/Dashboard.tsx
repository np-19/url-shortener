import { useCallback } from 'react';
import urlService from '../../services';
import UrlListPage from '../UrlList/UrlListPage';

const Dashboard = () => {
  const fetchUrls = useCallback((cursor?: string) => urlService.getAllUrls(cursor), []);

  return (
    <UrlListPage
      title="Dashboard"
      loadMessage="Loading dashboard..."
      fetchUrls={fetchUrls}
      emptyTitle="No URLs yet"
      emptyDescription="Get started by creating your first shortened URL on the home page."
    />
  );
};

export default Dashboard;
