import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export interface TrendingUrl {
  shortId: string;
  clicks: number;
  originalUrl: string;
}

export interface TimelinePoint {
  date: string;
  clicks: number;
  links: number;
}

export interface DistributionItem {
  shortId: string;
  clicks: number;
}

export interface AnalyticsData {
  trending: TrendingUrl[];
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
  clicksTimeline: TimelinePoint[];
  clicksDistribution: DistributionItem[];
  lastUpdated: number;
}

export const useAnalytics = () => {
  const fetchAnalytics = async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/analytics');
    return response.data as AnalyticsData;
  };

  const query = useQuery<AnalyticsData, Error>({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    analytics: query.data ?? null,
    loading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error instanceof Error ? query.error.message : '',
    refresh: query.refetch,
  };
};