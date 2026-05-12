import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis.js';
import { ExpressError } from '../utils/expressError.js';

/**
 * Rate Limiter Middleware using Sliding Window Counter approach
 * Limit: 100 requests per minute per IP
 * Uses Redis to track request counts and TTL for automatic reset
 * Adds rate limit headers to responses for client awareness
 * Handles Redis errors gracefully to avoid breaking the API
 */

const WINDOW_MS = 60_000;
const LIMIT = 100;
const KEY_PREFIX = 'rate-limit';

const getClientIdentifier = (req: Request): string => {
	return req.ip || req.socket.remoteAddress || 'unknown';
};

const getWindowStart = (timestamp: number): number => {
	return Math.floor(timestamp / WINDOW_MS) * WINDOW_MS;
};

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let redisClient;

	try {
		redisClient = getRedisClient();
	} catch (error: any) {
		console.error('Rate limiter disabled because Redis is unavailable: ', error.message);
		next();
		return;
	}

	const now = Date.now();
	const currentWindowStart = getWindowStart(now);
	const previousWindowStart = currentWindowStart - WINDOW_MS;
	const clientId = getClientIdentifier(req);
	const currentKey = `${KEY_PREFIX}:${clientId}:${currentWindowStart}`;
	const previousKey = `${KEY_PREFIX}:${clientId}:${previousWindowStart}`;

	try {
		const currentCount = await redisClient.incr(currentKey);
		if (currentCount === 1) {
			await redisClient.expire(currentKey, Math.ceil((WINDOW_MS * 2) / 1000));
		}

		const [previousCountRaw, currentCountRaw] = await Promise.all([
			redisClient.get(previousKey),
			redisClient.get(currentKey),
		]);

		const previousCount = Number(previousCountRaw ?? 0);
		const currentBucketCount = Number(currentCountRaw ?? 0);
		const elapsedInWindow = now - currentWindowStart;
		const weight = (WINDOW_MS - elapsedInWindow) / WINDOW_MS;
		const effectiveCount = Math.ceil(previousCount * weight + currentBucketCount);
		const remaining = Math.max(0, LIMIT - effectiveCount);
		const resetAt = new Date(currentWindowStart + WINDOW_MS);

		res.setHeader('X-RateLimit-Limit', String(LIMIT));
		res.setHeader('X-RateLimit-Remaining', String(remaining));
		res.setHeader('X-RateLimit-Reset', String(Math.floor(resetAt.getTime() / 1000)));

		if (effectiveCount > LIMIT) {
			res.setHeader('Retry-After', String(Math.ceil((resetAt.getTime() - now) / 1000)));
			throw new ExpressError('Too many requests, please try again later.', 429);
		}

		next();
	} catch (error: any) {
		if (error instanceof ExpressError) {
			throw error;
		}

		console.error('Rate limiter Redis error: ', error.message);
		next();
	}
};




