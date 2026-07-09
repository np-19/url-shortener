import type { IUrl } from "../types/mongo_types.js";
import { getAnalyticsStatsDB } from "../dao/url_dao.js";
import { trendingTopN } from "../config/constants.js";

// Compute top trending URLs from an array of URLs
export const computeTrendingUrls = (urls: IUrl[]) => {
  return urls
    .map((url) => ({
      shortId: url.shortId,
      clicks: url.clicks,
      originalUrl: url.originalUrl,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, trendingTopN);
};

// Build a clicks-per-day timeline from URL creation dates and click dates
const buildClicksTimeline = (urls: IUrl[]) => {
  const dayMap = new Map<string, { clicks: number; links: number }>();

  for (const url of urls) {
    // 1. Process URL creation date (link count)
    const creationDay = new Date(url.createdAt).toISOString().slice(0, 10);
    const creationEntry = dayMap.get(creationDay) ?? { clicks: 0, links: 0 };
    creationEntry.links += 1;
    dayMap.set(creationDay, creationEntry);

    // 2. Process click dates (clicks count)
    if (url.clicksByDate) {
      const clicksObj = url.clicksByDate instanceof Map 
        ? Object.fromEntries(url.clicksByDate) 
        : url.clicksByDate;

      for (const [clickDay, count] of Object.entries(clicksObj)) {
        const clickEntry = dayMap.get(clickDay) ?? { clicks: 0, links: 0 };
        clickEntry.clicks += count;
        dayMap.set(clickDay, clickEntry);
      }
    } else {
      // Fallback for legacy URLs: attribute all clicks to the creation date
      creationEntry.clicks += url.clicks;
    }
  }

  return Array.from(dayMap.entries())
    .map(([date, data]) => ({ date, clicks: data.clicks, links: data.links }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // last 30 days with data
};

// Build a clicks distribution array (per-URL)
const buildClicksDistribution = (urls: IUrl[]) => {
  return urls
    .map((url) => ({
      shortId: url.shortId,
      clicks: url.clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10); // top 10
};

// Get analytics summary for a specific user
export const getAnalyticsSummary = async (userId: string, userUrls: IUrl[]) => {
  const { totalUrls, totalClicks } = await getAnalyticsStatsDB(userId);
  
  // Calculate average, guard against division by zero
  const averageClicks = totalUrls > 0 
    ? Math.round((totalClicks / totalUrls) * 10) / 10 
    : 0;

  return {
    trending: computeTrendingUrls(userUrls),
    totalUrls,
    totalClicks,
    averageClicks,
    clicksTimeline: buildClicksTimeline(userUrls),
    clicksDistribution: buildClicksDistribution(userUrls),
    lastUpdated: Date.now(),
  };
};
