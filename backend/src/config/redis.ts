import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { redisHost, redisPort, redisUsername, redisPassword } from './constants.js';
import { ExpressError } from '../utils/expressError.js';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
	redisClient = createClient({
		username: redisUsername,
		password: redisPassword,
		socket: {
			host: redisHost,
			port: redisPort,
			connectTimeout: 5000,
		},
	});

	redisClient.on('error', (error) => {
		console.error('Redis connection error:', error);
	});

	redisClient.on('connect', () => {
		console.log('Redis connected successfully');
	});

	await redisClient.connect();
};

export const getRedisClient = (): RedisClientType => {
	if (!redisClient) {
		throw new ExpressError('Redis client not initialized. Call connectRedis() first.', 502);
	}
	return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
	if (redisClient) {
		await redisClient.close();
	}
};
