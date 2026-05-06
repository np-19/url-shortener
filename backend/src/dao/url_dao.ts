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

export const getAllUrlsDB = async () : Promise<IUrl[]> => {
    const urls: IUrl[] = await UrlModel.find()
        .sort({ createdAt: -1 })
        .limit(100);
    return urls;
}

export const getUrlsByUserIdDB = async (userId: string) : Promise<IUrl[]> => {
    const urls: IUrl[] = await UrlModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(100);
    return urls;
}

export const incrementClicksDB = async (shortId: string) : Promise<void> => {
    await UrlModel.findOneAndUpdate(
        { shortId },
        { $inc: { clicks: 1 } }
    );
}