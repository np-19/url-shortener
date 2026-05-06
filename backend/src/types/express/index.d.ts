import express from "express";
//Extend the Express Request interface to include a user property
//This allows us to attach user information to the request object after authentication
declare module "express" { //this line means we are extending the existing module "express"
    export interface Request { //this line means we are adding new properties to the existing Request interface
        user?: {
            userId: string;
            email: string;
        };
    }
}

export { }; //This line is necessary to make this file a module, which allows us to use the declaration merging feature of TypeScript to extend the Express Request interface