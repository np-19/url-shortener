import { createClient } from 'redis';
import { redisHost, redisPort, redisUsername, redisPassword } from './constants.js';
import { ExpressError } from '../utils/expressError.js';

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisConnectionPromise: Promise<void> | null = null;

export const connectRedis = async (): Promise<void> => {
	if (isRedisReady()) {
		return;
	}

	if (redisConnectionPromise) {
		return redisConnectionPromise;
	}

	const client = createClient({
		username: redisUsername,
		password: redisPassword,
		socket: {
			host: redisHost,
			port: redisPort,
			connectTimeout: 5000,
			reconnectStrategy: (retries) => {
				if (retries >= 2) {
					return false;
				}
				return Math.min(retries * 100, 1000);
			},
		},
	});

	client.on('error', (error) => {
		console.error('Redis connection error:', error);
	});

	client.on('connect', () => {
		console.log('Redis connected successfully');
	});

	redisConnectionPromise = client.connect()
		.then(() => {
			redisClient = client;
		})
		.catch((error) => {
			redisClient = null;
			console.warn('Redis unavailable. Continuing without Redis:', error.message);
		})
		.finally(() => {
			redisConnectionPromise = null;
		});

	return redisConnectionPromise;
};

export const isRedisReady = (): boolean => {
	return !!redisClient && redisClient.isOpen && redisClient.isReady;
};

export const getRedisClient = (): RedisClient => {
	if (!isRedisReady()) {
		throw new ExpressError('Redis unavailable.', 502);
	}
	return redisClient as RedisClient;
};

export const disconnectRedis = async (): Promise<void> => {
	if (redisClient?.isOpen) {
		await redisClient.close();
	}
	redisClient = null;
	redisConnectionPromise = null;
};
