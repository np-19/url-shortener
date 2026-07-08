import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth_types.js";
import { createUrlService } from "../services/url_service.js";
import { ExpressError } from "../utils/expressError.js";
import { findUrlByShortIdDB, getAllUrlsDB, getUrlsByUserIdDB, getUrlsByUserIdForAnalyticsDB, incrementClicksDB, isAliasInUseDB } from "../dao/url_dao.js";
import { getCachedUrl, setCachedUrl, incrementCachedClicks } from "../services/cache_service.js";
import { addToBloom, mightExistInBloom } from "../services/bloom_service.js";
import { getAnalyticsSummary } from "../services/analytics_service.js";
import type { CreateUrlRecord } from "../types/url_types.js";
import { createUrlSchema, type CreateUrlInput } from "../validations/url_val.js";
import { formatZodError } from "../utils/zodError.js";
import { neverExpiresAt, frontendUrl } from "../config/constants.js";


export const createUrlController = async (
  req: AuthenticatedRequest, res: Response
): Promise<void> => {
  const urlData = createUrlSchema.safeParse(req.body);
  if (!urlData.success) {
    throw new ExpressError(`Validation error: ${formatZodError(urlData.error)}`, 400);
  }

  const { originalUrl, expiresAt, customAlias }: CreateUrlInput = urlData.data;
  const expiresAtDate = expiresAt === 0 ? new Date(neverExpiresAt) : new Date(Date.now() + expiresAt * 1000);
  if (expiresAt > 0 && expiresAtDate.getTime() <= Date.now()) {
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
  // Add new shortId to Bloom filter in background (don't block response)
  setImmediate(async () => {
    try {
      await addToBloom(shortId);
    } catch (e) {
      console.error(`Failed to add ${shortId} to bloom filter:`, e);
    }
  });
  res.status(201).send({ shortId });
  return;
};

export const redirectUrlController = async (req: Request, res: Response): Promise<void> => {
  const { shortId } = req.params;
  // Fast negative check using Bloom filter to avoid unnecessary DB lookups
  const mightExist = await mightExistInBloom(shortId);
  if (!mightExist) {
    res.redirect(`${frontendUrl}/not-found`);
    return;
  }
  
  const cached = await getCachedUrl(shortId);
  let originalUrl: string = "";

  if (cached) {
    originalUrl = cached.originalUrl;
  } else {
    const url = await findUrlByShortIdDB(shortId);
    if (!url) {
      res.redirect(`${frontendUrl}/not-found`);
      return;
    }
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
  const cursor = req.query.cursor as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  const urls = await getAllUrlsDB(cursor, limit);
  const hasMore = urls.length === limit;
  const nextCursor = hasMore ? urls[urls.length - 1]._id : null;

  res.status(200).json({ urls, nextCursor, hasMore });
  return;
};

export const getMyUrlsController = async (
  req: AuthenticatedRequest, res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ExpressError("Unauthorized", 401);
  }

  const cursor = req.query.cursor as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  const urls = await getUrlsByUserIdDB(userId, cursor, limit);
  const hasMore = urls.length === limit;
  const nextCursor = hasMore ? urls[urls.length - 1]._id : null;

  res.status(200).json({ urls, nextCursor, hasMore });
  return;
};

export const getAnalyticsController = async (
  req: AuthenticatedRequest, res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ExpressError("Unauthorized", 401);
  }

  // Fetch only analytics fields for up to 100 URLs to keep the response fast
  const userUrls = await getUrlsByUserIdForAnalyticsDB(userId, 100);
  const analytics = await getAnalyticsSummary(userId, userUrls);
  res.status(200).json(analytics);
  return;
};

export const checkAliasAvailabilityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const alias = String(req.query.alias ?? '').trim();

  if (!alias) {
    throw new ExpressError('Alias is required', 400);
  }

  const isInUse = await isAliasInUseDB(alias);

  res.status(200).json({
    available: !isInUse,
    message: isInUse ? 'Alias is already in use' : 'Alias is available',
  });
};
