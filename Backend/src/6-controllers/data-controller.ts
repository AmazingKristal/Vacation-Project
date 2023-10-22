import express, { Request, Response, NextFunction } from "express";
import dataService from "../5-services/data-service";
import VacationModel from "../3-models/vacations-model";
import StatusCode from "../3-models/status-code";
import path from "path";
import verifyAdmin from "../4-middleware/verify-admin";

const router = express.Router();

// Get all vacations
router.get("/vacations", async (request: Request, response: Response, next: NextFunction) => {
    try {
        let vacations = await dataService.getAllVacations();
        response.json(vacations);
    }
    catch(err: any) {
        next(err);
    }
});

// GET One vacation
router.get('/vacations/:vacationId([0-9]+)', async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get the ID
        let vacationId = +request.params.vacationId;

        // Get one vacation from the database: 
        let vacation = await dataService.getOneVacation(vacationId);

        response.json(vacation);

    }
    catch(err: any) {
        next(err);
    }

});

// Add a vacation
router.post("/add-vacations", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        //Add image from request files into request body
        request.body.image = request.files?.image;

        console.log(request.body);

        // Create a new vacation with the request body
        let vacation = new VacationModel(request.body);

        // Add the vacation 
        let addedVacation = await dataService.addVacation(vacation);

        // Response that everything is AOK
        response.status(StatusCode.Created).json(addedVacation);
    }
    catch(err: any) {
        next(err);
    }
});

// Update a vacation
router.put("/update-vacations/:vacationId([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {

    // Extract route id into body:
    request.body.id = +request.params.vacationId;

    //Add image from request files into request body
    request.body.image = request.files?.image;

    // Get product sent from frontend:
    let vacation = new VacationModel(request.body);

    // Update product in database:
    const updatedVacation = await dataService.updateVacation(vacation);

    // Response back the updated product: 
    response.json(updatedVacation);
});

// Delete a vacation
router.delete("/vacations/:vacationId([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        let vacationId = +request.params.vacationId;
        await dataService.deleteVacation(vacationId);
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

// GET image name
router.get("/vacations/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get image name: 
        const imageName = request.params.imageName;

        // Get image absolute path:
        const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);

        console.log(absolutePath);

        // Response back the image file:
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;
