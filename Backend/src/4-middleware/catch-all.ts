import { NextFunction, Request, Response } from "express";
import StatusCode from "../3-models/status-code";

function catchAll(err: any, request: Request, response: Response, next: NextFunction) {
    
    // Display error: 
    console.log(err);

    // Find status code: 
    const statusCode = err.status || StatusCode.InternalServerError; // Short Circuit

    // Send back error details to frontend:
    response.status(statusCode).send(err.message);
}

export default catchAll;
