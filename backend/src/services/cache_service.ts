import { getRedisClient } from "../config/redis.js";
import type { CachedUrl } from "../types/url_types.js";
const DEFAULT_CACHE_TTL = 86400; // fallback 24 hours in seconds


export const setCachedUrl = async (shortId: string, originalUrl: string, expiresAt: Date): Promise<void> => {
	try {
		const redisClient = getRedisClient();
		const key = `url:${shortId}`;
		const payload = {
			originalUrl,
			clicks: "0",
		};
		const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
		const finalTtl = ttl > 0 ? ttl : DEFAULT_CACHE_TTL;
		await redisClient.hSet(key, payload);
		await redisClient.expire(key, finalTtl);
	} catch (err: any) {
		console.warn(`Redis unavailable, skipping cache set for ${shortId}: `, err.message);
	}
};
export const getCachedUrl = async (shortId: string): Promise< CachedUrl | null> => {
	try {
		const redisClient = getRedisClient();
		const key = `url:${shortId}`;
		const data = await redisClient.hGetAll(key);
		if (data && data.originalUrl) {
			return {
				originalUrl: data.originalUrl,
				clicks: Number(data.clicks) || 0,
			};
		}
		return null;
	} catch (err: any) {
		console.warn(`Redis unavailable, getCachedUrl returning null for ${shortId}: `, err.message);
		return null;
	}
}

export const incrementCachedClicks = async (shortId: string): Promise<void> => {
 	try {
 		const redisClient = getRedisClient();
 		const key = `url:${shortId}`;
 		await redisClient.hIncrBy(key, "clicks", 1);
 	} catch (err: any) {
 		console.warn(`Redis unavailable, skipping incrementCachedClicks for ${shortId}: `, err.message);
 	}
}