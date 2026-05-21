import { UrlModel } from "../models/url_model.js";
import type { IUrl } from "../types/mongo_types.js";
import type { CreateUrlRecord } from "../types/url_types.js";


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

export const getAllUrlsDB = async (cursor?: string, limit: number = 20) : Promise<IUrl[]> => {
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const urls: IUrl[] = await UrlModel.find(query)
        .sort({ _id: -1 })
        .limit(limit);
    return urls;
}

export const getUrlsByUserIdDB = async (userId: string, cursor?: string, limit: number = 20) : Promise<IUrl[]> => {
    const query: any = { userId };
    if (cursor) {
        query._id = { $lt: cursor };
    }
    const urls: IUrl[] = await UrlModel.find(query)
        .sort({ _id: -1 })
        .limit(limit);
    return urls;
}

export const incrementClicksDB = async (shortId: string) : Promise<void> => {
    await UrlModel.findOneAndUpdate(
        { shortId },
        { $inc: { clicks: 1 } }
    );
}

export const getAnalyticsStatsDB = async (userId: string): Promise<{ totalUrls: number; totalClicks: number }> => {
    const totalUrls = await UrlModel.countDocuments({ userId });
    
    const result = await UrlModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
    ]);
    
    const totalClicks = result.length > 0 ? result[0].totalClicks : 0;
    
    return { totalUrls, totalClicks };
}