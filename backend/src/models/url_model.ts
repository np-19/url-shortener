import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

interface IUrl extends Document {
  originalUrl: string;
  shortId: string;
  clicks: number;
  userId?: string;
  qrCodeDataUrl?: string;
  createdAt: Date;
  expiresAt: Date; 
  updatedAt: Date;
}

const urlSchema: Schema = new Schema<IUrl>(
  {
    originalUrl: {
         type: String,
        required: true
     },
    shortId: { 
        type: String,
        required: true,
        unique: true 
    },
    clicks: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    qrCodeDataUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
  },
  { timestamps: true }
);

urlSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 }); //Auto-delete expired documents
urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

export const UrlModel = mongoose.model<IUrl>("Url", urlSchema);
export type { IUrl };