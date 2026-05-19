import dotenv from 'dotenv';
dotenv.config();

const nanoidSize: number = Number(process.env.NANOID_SIZE);
const port: number = Number(process.env.PORT || 3000);
const mongoUri: string = String(process.env.MONGO_URI);
const frontendUrl: string = String(process.env.FRONTEND_URL);
const jwtSecret: string = String(process.env.JWT_SECRET || 'your-secret-key-change-in-production');
const jwtExpiresIn: string = String(process.env.JWT_EXPIRES_IN || '7d');
const snowflakeCustomEpoch: number = Number(process.env.SNOWFLAKE_CUSTOM_EPOCH || 1735689600000);
const snowflakeMachineIdBits: number = Number(process.env.SNOWFLAKE_MACHINE_ID_BITS || 4);
const snowflakeSequenceBits: number = Number(process.env.SNOWFLAKE_SEQUENCE_BITS || 18);
const snowflakeMachineId: number = Number(process.env.SNOWFLAKE_MACHINE_ID || 1);
const redisHost: string = String(process.env.REDIS_HOST || 'localhost');
const redisPort: number = Number(process.env.REDIS_PORT) || 6379;
const redisUsername: string = String(process.env.REDIS_USERNAME || 'default');
const redisPassword: string = String(process.env.REDIS_PASSWORD || '');

// Bloom Filter Configuration
const bloomEstimatedUrls: number = Number(process.env.BLOOM_ESTIMATED_URLS || 1_000_000);
const bloomBits: number = Number(process.env.BLOOM_BITS || 10_000_000);
const bloomHashFunctions: number = Number(process.env.BLOOM_HASH_FUNCTIONS || 7);
const bloomRebuildIntervalMs: number = Number(process.env.BLOOM_REBUILD_INTERVAL_MS || 3_600_000); // 1 hour

// Rate Limiter Configuration
const rateLimitWindowMs: number = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000); // 1 minute
const rateLimitRequests: number = Number(process.env.RATE_LIMIT_REQUESTS || 100);

// Analytics Configuration
const trendingTopN: number = Number(process.env.TRENDING_TOP_N || 10);
const neverExpiresAt: string = '9999-12-31T23:59:59.999Z';

export {
	nanoidSize,
	port,
	mongoUri,
	frontendUrl,
	jwtSecret,
	jwtExpiresIn,
	snowflakeCustomEpoch,
	snowflakeMachineIdBits,
	snowflakeSequenceBits,
	snowflakeMachineId,
	redisHost,
	redisPort,
	redisUsername,
	redisPassword,
	bloomEstimatedUrls,
	bloomBits,
	bloomHashFunctions,
	bloomRebuildIntervalMs,
	rateLimitWindowMs,
	rateLimitRequests,
	trendingTopN,
	neverExpiresAt
};

