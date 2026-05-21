import { useEffect, useState } from 'react';
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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get('/analytics');
      setAnalytics(response.data as AnalyticsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics();

    const interval = window.setInterval(() => {
      void fetchAnalytics();
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
};