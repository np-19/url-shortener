import { MinHeap } from "../utils/minHeap.js";
import type { IUrl } from "../types/mongo_types.js";
import { trendingTopN } from "../config/constants.js";

// Global instance of trending URLs heap (top N by clicks)
const trendingHeap = new MinHeap(trendingTopN);
let lastUpdated = Date.now();

// Rebuild trending heap from all URLs in database
export const rebuildTrendingUrls = async (urls: IUrl[]): Promise<void> => {
  trendingHeap.clear();
  
  for (const url of urls) {
    trendingHeap.add({
      shortId: url.shortId,
      clicks: url.clicks,
      originalUrl: url.originalUrl,
    });
  }
  
  lastUpdated = Date.now();
};

// Update a single URL's click count in the heap (idempotent, prevents duplicates)
export const updateUrlClicks = (shortId: string, clicks: number, originalUrl: string): void => {
  trendingHeap.add({
    shortId,
    clicks,
    originalUrl,
  });
  // Note: If shortId already exists in heap, it will be updated in-place
  // If not and heap has space, it will be added
  // If heap is full and clicks < root, it will be ignored (not top 10)
};

// Get top trending URLs
export const getTrendingUrls = () => {
  return trendingHeap.getTopItems();
};

// Get analytics summary
export const getAnalyticsSummary = (allUrls: IUrl[]) => {
  const trending = trendingHeap.getTopItems();
  const totalClicks = allUrls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks = allUrls.length > 0 ? totalClicks / allUrls.length : 0;

  return {
    trending,
    totalUrls: allUrls.length,
    totalClicks,
    averageClicks: Math.round(averageClicks * 100) / 100,
    lastUpdated,
  };
};
