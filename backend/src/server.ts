import express from "express";
import cors from "cors";
import { port, frontendUrl } from "./config/constants.js";
import { connectDB } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import urlRoutes from "./routes/url_routes.js";
import authRoutes from "./routes/auth_routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { rateLimiterMiddleware } from "./middlewares/rateLimiter.js";
import { wrapAsync } from "./utils/wrapAsync.js";
import { redirectUrlController } from "./controllers/url_controller.js";
import { rebuildBloomFromDatabase } from "./services/bloom_service.js";

const app = express();

// ==================== Middlewares ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: frontendUrl,
    exposedHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "Retry-After",
    ],
    optionsSuccessStatus: 200,
  })
);

app.use(wrapAsync(rateLimiterMiddleware));

// ==================== Routes ====================

app.use("/api/auth", authRoutes);
app.use("/api", urlRoutes);

app.get("/:shortId", wrapAsync(redirectUrlController));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

// ==================== Startup ====================

const startServer = async () => {
  try {
    // Critical dependency
    await connectDB();
    console.log("MongoDB connected");

    // Optional dependency
    try {
      await connectRedis();
      console.log("Redis connected");

      await rebuildBloomFromDatabase();
      console.log("Bloom filter rebuilt");
    } catch (err) {
      console.warn("Redis unavailable. Starting without Redis.");
      console.error(err);
    }

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server");
    console.error(err);
    process.exit(1);
  }
};

startServer();
