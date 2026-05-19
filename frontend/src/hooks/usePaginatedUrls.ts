import { useCallback, useEffect, useState } from 'react';
import type { UrlItem, UrlsResponse } from '../services';

type FetchUrls = (cursor?: string) => Promise<UrlsResponse>;

export const usePaginatedUrls = (fetchUrls: FetchUrls) => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const applyResponse = useCallback((data: UrlsResponse, reset: boolean) => {
    setUrls((current) => (reset ? data.urls : [...current, ...data.urls]));
    setNextCursor(data.nextCursor ?? null);
    setHasMore(data.hasMore ?? false);
    setError('');
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchUrls();
      applyResponse(data, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [applyResponse, fetchUrls]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);

    try {
      const data = await fetchUrls(nextCursor ?? undefined);
      applyResponse(data, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [applyResponse, fetchUrls, nextCursor]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    urls,
    loading,
    loadingMore,
    error,
    hasMore,
    nextCursor,
    refresh,
    loadMore,
  };
};
