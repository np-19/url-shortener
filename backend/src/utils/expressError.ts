import type { IExpressError } from "../types/error_types.js";

class ExpressError extends Error implements IExpressError {
    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}

export { ExpressError };