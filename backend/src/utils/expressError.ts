interface IExpressError {
    statusCode: number;
    message: string;
}   


class ExpressError extends Error implements IExpressError {
    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}



export { ExpressError };

// class ExpressError extends Error implements IExpressError {
//     statusCode: number;
//     message: string;

//     constructor(message: string, statusCode: number) {
//         super(message);
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

