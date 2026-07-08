import { useInfiniteQuery } from '@tanstack/react-query';
import type { UrlItem, UrlsResponse } from '../services';

type FetchUrls = (cursor?: string) => Promise<UrlsResponse>;

export const usePaginatedUrls = (queryKey: string, fetchUrls: FetchUrls) => {
  const query = useInfiniteQuery<UrlsResponse, Error>({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => fetchUrls(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });

  const pages: UrlsResponse[] = query.data?.pages ?? [];
  const urls: UrlItem[] = pages.flatMap((page) => page.urls);
  const nextCursor = pages.length > 0 ? (pages[pages.length - 1].nextCursor ?? null) : null;
  const hasMore = query.hasNextPage;

  const refresh = async () => {
    await query.refetch();
  };

  const loadMore = async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }
    await query.fetchNextPage();
  };

  return {
    urls,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    isRefreshing: query.isRefetching,
    error: query.error instanceof Error ? query.error.message : '',
    hasMore,
    nextCursor,
    refresh,
    loadMore,
  };
};
