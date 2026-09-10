import { getRedisClient } from "../config/redis.js";
import type { CachedUrl } from "../types/url_types.js";
import { neverExpiresAt } from "../config/constants.js";
const DEFAULT_CACHE_TTL = 86400; // fallback 24 hours in seconds


export const setCachedUrl = async (shortId: string, originalUrl: string, expiresAt: Date): Promise<void> => {
	try {
		const redisClient = getRedisClient();
		const key = `url:${shortId}`;
		if (expiresAt.toISOString() === neverExpiresAt) {
			await redisClient.set(key, originalUrl);
			return;
		}
		const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
		const finalTtl = ttl > 0 ? ttl : DEFAULT_CACHE_TTL;
		await redisClient.set(key, originalUrl, 'EX', finalTtl);
	} catch (err: any) {
		console.warn(`Redis unavailable, skipping cache set for ${shortId}: `, err.message);
	}
};
export const getCachedUrl = async (shortId: string): Promise< CachedUrl | null> => {
	try {
		const redisClient = getRedisClient();
		const key = `url:${shortId}`;
		const originalUrl = await redisClient.get(key);
		if (originalUrl) {
			return {
				originalUrl,
			};
		}
		return null;
	} catch (err: any) {
		console.warn(`Redis unavailable, getCachedUrl returning null for ${shortId}: `, err.message);
		return null;
	}
}
