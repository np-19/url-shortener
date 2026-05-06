import dotenv from 'dotenv';
dotenv.config();

const nanoidSize: number = Number(process.env.NANOID_SIZE);
const port: number = Number(process.env.PORT);
const mongoUri: string = String(process.env.MONGO_URI);
const frontendUrl: string = String(process.env.FRONTEND_URL);
const jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
const snowflakeCustomEpoch: number = Number(process.env.SNOWFLAKE_CUSTOM_EPOCH || 1735689600000);
const snowflakeMachineIdBits: number = Number(process.env.SNOWFLAKE_MACHINE_ID_BITS || 4);
const snowflakeSequenceBits: number = Number(process.env.SNOWFLAKE_SEQUENCE_BITS || 18);
const snowflakeMachineId: number = Number(process.env.SNOWFLAKE_MACHINE_ID || 1);

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
};
