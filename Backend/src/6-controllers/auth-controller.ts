import express, { NextFunction, Request, Response } from "express";
import UserModel from "../3-models/user-model";
import authService from "../5-services/auth-service";
import StatusCode from "../3-models/status-code";
import CredentialsModel from "../3-models/credentials-model";

// Create the router part of express:
const router = express.Router();

// POST http://localhost:4000/api/register
router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get user: 
        const user = new UserModel(request.body);

        // Add user to database: 
        const token = await authService.register(user);

        // Response back the token:
        response.status(StatusCode.Created).json(token);
        
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:4000/api/login
router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get credentials: 
        const credentials = new CredentialsModel(request.body);

        // login: 
        const token = await authService.login(credentials);

        // Response back the token:
        response.json(token);
        
    }
    catch (err: any) {
        next(err);
    }
});

// Export the above router:
export default router;

