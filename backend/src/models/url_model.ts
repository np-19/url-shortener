import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IUrl } from "../types/mongo_types.js";




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
