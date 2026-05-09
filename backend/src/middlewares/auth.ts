import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ExpressError } from "../utils/expressError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ExpressError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      throw new ExpressError("Invalid or expired token", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // If token is invalid, we simply ignore it and proceed without authentication
    }
  }
  next();
};

export const authorize = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new ExpressError("Unauthorized", 401));
  }
  next();
};

