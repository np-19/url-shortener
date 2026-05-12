import mongoose from "mongoose";
import { mongoUri } from "./constants.js";


export const connectDB = async (): Promise<void> => {  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");

  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // Rethrow to allow handling in server startup
  }
};

export const db = mongoose.connection;

