
export const errorHandler = (err: any, req: any, res: any, next: any) => {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || "Internal Server Error";
    // Log full error for debugging
    console.error(`Error on ${req.method} ${req.originalUrl}:`, err.stack || err);
    res.status(statusCode).send({ message });
};
