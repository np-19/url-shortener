import { Request, Response } from "express";
import { createUrlService } from "../services/url_service.js";
import { ExpressError } from "../utils/expressError.js";
import { findUrlByShortIdDB, getAllUrlsDB, getUrlsByUserIdDB, incrementClicksDB } from "../dao/url_dao.js";
import type { CreateUrlRecord, CreateUrlRequestBody } from "../types/url_types.js";

export const createUrlController = async (
  req: Request, res: Response
): Promise<void> => {

  const { Url, customAlias }: CreateUrlRequestBody = req.body;
  const expiresAt = new Date(Date.now() + Url.expiresAt * 1000);
  if (expiresAt.getTime() <= Date.now()) {
    throw new ExpressError("Expiration time must be in the future", 400);
  }

  const userId = req.user?.userId;
  const urlToSave: CreateUrlRecord = {
    originalUrl: Url.originalUrl,
    expiresAt,
    ...(userId ? { userId } : {}),
  };

  const shortId = await createUrlService(urlToSave, customAlias);
  res.status(201).send({ shortId });
  return;
};

export const redirectUrlController = async (
  req: Request, res: Response
): Promise<void> => {
  const { shortId } = req.params;
  const url = await findUrlByShortIdDB(shortId);
  if (!url) throw new ExpressError("URL not found", 404);
  await incrementClicksDB(shortId);
  res.redirect(url.originalUrl);
  return;
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
