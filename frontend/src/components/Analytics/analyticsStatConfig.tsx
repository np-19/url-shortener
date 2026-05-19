import type { AnalyticsData } from '../../hooks/useAnalytics';

export const getAnalyticsStatConfig = (analytics: AnalyticsData) => [
  {
    title: 'Total Links',
    value: analytics.totalUrls,
    description: 'Shortened URLs created',
    accentClassName: 'text-forest-500',
    iconBackgroundClassName: 'border-forest-100/50 bg-linear-to-br from-forest-50 to-forest-100',
    iconClassName: 'text-forest-600',
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  },
  {
    title: 'Total Clicks',
    value: analytics.totalClicks.toLocaleString(),
    description: 'Total redirects served',
    accentClassName: 'text-blue-500',
    iconBackgroundClassName: 'border-blue-100/50 bg-linear-to-br from-blue-50 to-blue-100',
    iconClassName: 'text-blue-600',
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  },
  {
    title: 'Avg Clicks',
    value: analytics.averageClicks,
    description: 'Average per URL',
    accentClassName: 'text-purple-500',
    iconBackgroundClassName: 'border-purple-100/50 bg-linear-to-br from-purple-50 to-purple-100',
    iconClassName: 'text-purple-600',
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
];
