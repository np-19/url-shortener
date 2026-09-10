import type { NextFunction, Request, Response } from "express";

export const performanceLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;
    console.log(
      `Request: ${req.method} ${req.url} - Duration: ${duration} ms`,
    );
  });

  next();
};
