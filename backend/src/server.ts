
import express from 'express';
import cors from 'cors';
import {port, frontendUrl} from "./config/constants.js";
import { connectDB } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import urlRoutes from "./routes/url_routes.js";
import authRoutes from "./routes/auth_routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { rateLimiterMiddleware } from "./middlewares/rateLimiter.js";
import { wrapAsync } from "./utils/wrapAsync.js";
import { redirectUrlController } from "./controllers/url_controller.js";



const app = express();
const startServer = async (): Promise<void> => {
  await connectDB();
  await connectRedis();



  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  app.use(cors({
    origin: frontendUrl,
    optionsSuccessStatus: 200,
  }));

  // Rate limiting middleware (applied to all routes)
  app.use(wrapAsync(rateLimiterMiddleware));

  app.use('/api/auth', authRoutes);
  app.use('/api', urlRoutes);

  // Redirect route for short URLs (must be last)
  app.get('/:shortId', wrapAsync(redirectUrlController));

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
