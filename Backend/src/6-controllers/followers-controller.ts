import express, { Request, Response, NextFunction } from "express";
import dataService from "../5-services/data-service";
import VacationModel from "../3-models/vacations-model";
import StatusCode from "../3-models/status-code";
import path from "path";
import verifyAdmin from "../4-middleware/verify-admin";
import followersService from "../5-services/followers-service";
import FollowersModel from "../3-models/followers-model";

const router = express.Router();

// Get all vacations
router.get("/followers/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        let followers = await followersService.getAllFollowers();
        response.json(followers);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/followers-by-vacation/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        let vacationId = +request.params.vacationId;
        let followers = await followersService.getFollowersByVacation(vacationId);
        response.json(followers);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/followers/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        let follower = new FollowersModel(request.body);
        let addedFollower = await followersService.addFollower(follower);
        response.status(StatusCode.Created).json(addedFollower);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/followers/:userId/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        let userId = +request.params.userId;
        let vacationId = +request.params.vacationId;
        await followersService.deleteFollower(userId, vacationId);
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;