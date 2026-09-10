import { createClient, type RedisClientType } from 'redis';
import { redisHost, redisPort, redisUsername, redisPassword } from './constants.js';
import { ExpressError } from '../utils/expressError.js';
import {attachDatabasePool} from "@vercel/functions";

type RedisClient = RedisClientType;

let redisClient: RedisClient | null = null;
let redisConnectionPromise: Promise<void> | null = null;
let lastRedisFailureAt = 0;
const REDIS_RETRY_COOLDOWN_MS = 30_000;

export const connectRedis = async (): Promise<void> => {
	if (isRedisReady()) return;
	if (redisConnectionPromise) return redisConnectionPromise;
	if (Date.now() - lastRedisFailureAt < REDIS_RETRY_COOLDOWN_MS) return;

	const client = createClient({
		username: redisUsername,
		password: redisPassword,
		socket: {
			host: redisHost,
			port: redisPort,
			connectTimeout: 5000,
			reconnectStrategy: (retries) => retries >= 2 ? false : Math.min(retries * 100, 1000),
		},
	});
	attachDatabasePool(client);
	client.on('error', (error) => console.error('Redis connection error:', error));
	client.on('connect', () => console.log('Redis connected successfully'));

	const connectionPromise = client.connect()
        .then(() => {
            redisClient = client;
			lastRedisFailureAt = 0;
        })
        .catch((error) => {
			lastRedisFailureAt = Date.now();
			client.destroy();
			console.warn('Redis unavailable. Continuing without Redis:', error.message);
        })
        .finally(() => {
            redisConnectionPromise = null;
        });

	redisConnectionPromise = connectionPromise;
	return connectionPromise;
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
	if (redisClient?.isOpen) await redisClient.close();
	redisClient = null;
    redisConnectionPromise = null;
	lastRedisFailureAt = 0;
};