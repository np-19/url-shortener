import { Types } from "mongoose";
import { UrlModel } from "../models/url_model.js";
import type { IUrl } from "../types/mongo_types.js";
import type { CreateUrlRecord } from "../types/url_types.js";

const getNormalizedUserId = (userId: string): string | Types.ObjectId => {
    return Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
};


export const saveUrlDB = async (URL: CreateUrlRecord, shortId: string) : Promise<IUrl> => {
    const newUrl: IUrl = new UrlModel({ ...URL, shortId });
    const savedUrl = await newUrl.save();
    return savedUrl;
}

export const findUrlByShortIdDB = async (shortId: string) : Promise<IUrl | null> => {
    const url: IUrl | null = await UrlModel.findOne({ shortId });
    if(!url) {
        return null;
    }
    return url;
}

export const isAliasInUseDB = async (shortId: string): Promise<boolean> => {
    const url = await UrlModel.exists({ shortId });
    return url !== null;
}

export const getAllUrlsDB = async (cursor?: string, limit: number = 20) : Promise<IUrl[]> => {
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const urls: IUrl[] = await UrlModel.find(query)
        .sort({ _id: -1 })
        .limit(limit);
    return urls;
}

export const getUrlsByUserIdDB = async (userId: string, cursor?: string, limit: number = 20) : Promise<IUrl[]> => {
    const query: any = { userId: getNormalizedUserId(userId) };
    if (cursor) {
        query._id = { $lt: cursor };
    }
    const urls: IUrl[] = await UrlModel.find(query)
        .sort({ _id: -1 })
        .limit(limit);
    return urls;
}

export const getUrlsByUserIdForAnalyticsDB = async (userId: string, limit: number = 100): Promise<IUrl[]> => {
    const urls: IUrl[] = await UrlModel.find({ userId: getNormalizedUserId(userId) })
        .select({ shortId: 1, clicks: 1, originalUrl: 1, createdAt: 1 })
        .sort({ _id: -1 })
        .limit(limit)
        .lean<IUrl[]>();

    return urls;
}

export const incrementClicksDB = async (shortId: string) : Promise<void> => {
    await UrlModel.findOneAndUpdate(
        { shortId },
        { $inc: { clicks: 1 } }
    );
}

export const getAnalyticsStatsDB = async (userId: string): Promise<{ totalUrls: number; totalClicks: number }> => {
    const result = await UrlModel.aggregate([
        { $match: { userId: getNormalizedUserId(userId) } },
        {
            $group: {
                _id: null,
                totalUrls: { $sum: 1 },
                totalClicks: { $sum: "$clicks" }
            }
        }
    ]);

    if (result.length === 0) {
        return { totalUrls: 0, totalClicks: 0 };
    }

    return {
        totalUrls: result[0].totalUrls,
        totalClicks: result[0].totalClicks,
    };
}