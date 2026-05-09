
export const errorHandler = (err: any, req: any, res: any, next: any) => {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || "Internal Server Error";
    res.status(statusCode).send({ message });
};
