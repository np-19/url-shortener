import type { Request, Response, NextFunction } from "express";
import type { IExpressError } from "../types/error_types.js";
export const errorHandler = (err: IExpressError, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || "Internal Server Error";
    res.status(statusCode).send({ message });
};
