import { generateShortId } from "../utils/shortId.js";
import { saveUrlDB } from "../dao/url_dao.js";
import { ExpressError } from "../utils/expressError.js";
import type { CreateUrlRecord } from "../types/url_types.js";

export const createUrlService = async (Url: CreateUrlRecord, customAlias?: string): Promise<string> => {
    let shortId: string = "";
    //CUSTOM URL
    if (customAlias) {
        shortId = customAlias;
        try {
            const savedUrl = await saveUrlDB(Url, shortId);
            return savedUrl.shortId;
        } catch (error: any) {
            // E11000 is the MongoDB duplicate key error code
            if (error.code === 11000) {
                throw new ExpressError("Custom alias already in use", 409);
            }
            throw error;
        }
    } else {
        // Default: Generate sequential Base62 ID
        shortId = generateShortId();
        const savedUrl = await saveUrlDB(Url, shortId);
        return savedUrl.shortId;
    }
};
