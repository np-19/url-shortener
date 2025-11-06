import type { IUrl } from "../models/url_model.js";
import { generateShortId } from "../utils/helper.js";
import { nanoidSize } from "../config/constants.js";
import { saveUrl } from "../dao/url_dao.js";


export const createUrlService = async (Url: IUrl): Promise<string> => {
            const shortId = generateShortId(nanoidSize);
            const savedUrl = await saveUrl(Url, shortId);
            return savedUrl.shortId;
};