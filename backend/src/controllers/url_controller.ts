import { Request, Response } from "express";
import { createUrlService } from "../services/url_service.js";
import { ExpressError } from "../utils/expressError.js";
import { findUrlByShortIdDB, getAllUrlsDB, getUrlsByUserIdDB, incrementClicksDB } from "../dao/url_dao.js";
import { getCachedUrl, setCachedUrl, incrementCachedClicks } from "../services/cache_service.js";
import type { CreateUrlRecord } from "../types/url_types.js";
import { createUrlSchema, type CreateUrlInput } from "../validations/url_val.js";
import { formatZodError } from "../utils/zodError.js";


export const createUrlController = async (
  req: Request, res: Response
): Promise<void> => {
  const urlData = createUrlSchema.safeParse(req.body);
  if (!urlData.success) {
    throw new ExpressError(`Validation error: ${formatZodError(urlData.error)}`, 400);
  }

  const { originalUrl, expiresAt, customAlias }: CreateUrlInput = urlData.data;
  const expiresAtDate = new Date(Date.now() + expiresAt * 1000);
  if (expiresAtDate.getTime() <= Date.now()) {
    throw new ExpressError("Expiration time must be in the future", 400);
  }

  const userId = req.user?.userId;
  const urlToSave: CreateUrlRecord = {
    originalUrl,
    expiresAt: expiresAtDate,
    ...(userId ? { userId } : {}),
  };

  const shortId = await createUrlService(urlToSave, customAlias);
  // Store in cache with TTL based on expiresAt so Redis auto-evicts
  await setCachedUrl(shortId, urlToSave.originalUrl, urlToSave.expiresAt);
  res.status(201).send({ shortId });
  return;
};

export const redirectUrlController = async (req: Request, res: Response): Promise<void> => {
  const { shortId } = req.params;
  
  const cached = await getCachedUrl(shortId);
  let originalUrl: string = "";

  if (cached) {
    originalUrl = cached.originalUrl;
  } else {
    const url = await findUrlByShortIdDB(shortId);
    if (!url) throw new ExpressError("URL not found", 404);
    originalUrl = url.originalUrl;

    // Background task: Populate cache
    setImmediate(async () => {
      try { await setCachedUrl(shortId, originalUrl, url.expiresAt); } 
      catch (e) { console.error("Cache population failed", e); }
    });
  }

  // 1. Send the redirect first for speed
  res.redirect(originalUrl);

  // 2. Wrap background updates in an async block with error handling
  setImmediate(async () => {
    try {
      // Run these in parallel to be efficient
      await Promise.all([
        incrementCachedClicks(shortId),
        incrementClicksDB(shortId)
      ]);
    } catch (error) {
      // Log this to a service like Sentry or Winston
      console.error(`Analytics update failed for ${shortId}:`, error);
    }
  });
};

export const getAllUrlsController = async (
  req: Request, res: Response
): Promise<void> => {
  const urls = await getAllUrlsDB();
  res.status(200).json({ urls });
  return;
};

export const getMyUrlsController = async (
  req: Request, res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ExpressError("Unauthorized", 401);
  }
  const urls = await getUrlsByUserIdDB(userId);
  res.status(200).json({ urls });
  return;
};
