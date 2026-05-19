import { useEffect, useState } from 'react';
import constants from '../configs/constants';

export interface TrendingUrl {
  shortId: string;
  clicks: number;
  originalUrl: string;
}

export interface AnalyticsData {
  trending: TrendingUrl[];
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
  lastUpdated: number;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${constants.backendUrl}/api/analytics`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = (await response.json()) as AnalyticsData;
      setAnalytics(data);
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