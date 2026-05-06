import {Document} from "mongoose";

export interface ICounter extends Document{
    _id: string;
    seq: number;
}

export interface IUrl extends Document {
  originalUrl: string;
  shortId: string;
  clicks: number;
  userId?: string;
  createdAt: Date;
  expiresAt: Date; 
  updatedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}