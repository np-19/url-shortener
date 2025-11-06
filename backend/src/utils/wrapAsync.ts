import { Request, Response, NextFunction, RequestHandler } from "express";

export const wrapAsync = (fn: (
    req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
    };
};
