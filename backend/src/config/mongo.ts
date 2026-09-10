import mongoose from "mongoose";
import { mongoUri } from "./constants.js";
import { attachDatabasePool } from "@vercel/functions";

export const connectDB = async (): Promise<void> => {  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 5000,
    });
    console.log("MongoDB connected");
    attachDatabasePool(mongoose.connection.getClient());

  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // Rethrow to allow handling in server startup
  }
};

export const db = mongoose.connection;

