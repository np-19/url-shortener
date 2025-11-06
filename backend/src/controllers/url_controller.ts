import { Request, Response } from "express";
import { createUrlService } from "../services/url_service.js";
import { ExpressError } from "../utils/expressError.js";
import { findUrlByShortId } from "../dao/url_dao.js";

export const createUrlController = async (
    req: Request, res: Response
): Promise<void> => {
  const { Url } = req.body;
  Url.expiresAt = new Date(Date.now() + Url.expiresAt * 1000);
  const shortId = await createUrlService(Url);
  res.status(201).send({ shortId });
  return;
};

export const redirectUrlController = async (
  req: Request, res: Response
): Promise<void> => {
  const { shortId } = req.params;
  const url = await findUrlByShortId(shortId);
  if (!url) throw new ExpressError("URL not found", 404);
  res.redirect(url.originalUrl);
  return;
};
