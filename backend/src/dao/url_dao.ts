import { UrlModel } from "../models/url_model.js";
import type { IUrl } from "../models/url_model.js";


export const saveUrl = async (URL: IUrl, shortId: string) : Promise<IUrl> => {
    const newUrl = new UrlModel({ ...URL, shortId });
    const savedUrl = await newUrl.save();
    return savedUrl;
}

export const findUrlByShortId = async (shortId: string) : Promise<IUrl | null> => {
    const url: IUrl | null = await UrlModel.findOne({ shortId });
    return url;
}