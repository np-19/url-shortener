import { Redis } from 'ioredis';
import { attachDatabasePool } from '@vercel/functions';

import {
    redisHost,
    redisPort,
    redisUsername,
    redisPassword
} from './constants.js';

import { ExpressError } from '../utils/expressError.js';

const redisClient = new Redis({
    lazyConnect: true,

    username: redisUsername,
    password: redisPassword,
    host: redisHost,
    port: redisPort,

    connectTimeout: 5000,
    maxRetriesPerRequest: 1,

    retryStrategy: (retries: number) =>
        retries >= 2 ? null : Math.min(retries * 100, 1000),
});

attachDatabasePool(redisClient);

let redisConnectionPromise: Promise<void> | null = null;
let lastRedisFailureAt = 0;

const REDIS_RETRY_COOLDOWN_MS = 30_000;

redisClient.on('error', (error: Error) => {
    console.error('Redis connection error:', error);
});

redisClient.on('ready', () => {
    console.log('Redis connected successfully');
});


export const connectRedis = async (): Promise<void> => {

    if (isRedisReady()) {
        return;
    }

    if (redisConnectionPromise) {
        return redisConnectionPromise;
    }

    if (Date.now() - lastRedisFailureAt < REDIS_RETRY_COOLDOWN_MS) {
        return;
    }

    redisConnectionPromise = redisClient
        .connect()
        .then(() => {
            lastRedisFailureAt = 0;
        })
        .catch((error: Error) => {
            lastRedisFailureAt = Date.now();

            console.warn(
                'Redis unavailable. Continuing without Redis:',
                error.message
            );
        })
        .finally(() => {
            redisConnectionPromise = null;
        });

    return redisConnectionPromise;
};


export const isRedisReady = (): boolean => {
    return redisClient.status === 'ready';
};


export const getRedisClient = (): Redis => {

    if (!isRedisReady()) {
        throw new ExpressError('Redis unavailable.', 502);
    }

    return redisClient;
};


export const disconnectRedis = async (): Promise<void> => {

    if (
        redisClient.status === 'ready' ||
        redisClient.status === 'connecting'
    ) {
        redisClient.disconnect();
    }

    redisConnectionPromise = null;
    lastRedisFailureAt = 0;
};