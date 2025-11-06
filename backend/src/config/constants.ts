import dotenv from 'dotenv';
dotenv.config();

const nanoidSize: number = Number(process.env.NANOID_SIZE);
const port: number = Number(process.env.PORT);
const mongoUri: string = String(process.env.MONGO_URI);
const baseUrl: string = String(process.env.BASE_URL);
const frontendUrl: string = String(process.env.FRONTEND_URL);
export { nanoidSize, port, mongoUri, baseUrl, frontendUrl };
