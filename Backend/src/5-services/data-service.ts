import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import VacationModel from "../3-models/vacations-model";
import { ResourceNotFoundError } from "../3-models/client-errors";
import imageHelper from "../2-utils/image-helper";
import appConfig from "../2-utils/app-config";

async function getAllVacations(): Promise<VacationModel[]> {
    let sql = 'SELECT * FROM vacations ORDER BY startDate ASC';
    let vacations = await dal.execute(sql);
    return vacations.map(v => ({
        ...v,
        imageUrl: `${appConfig.domainName}/api/vacations/${v.imageName}`
    }));
}

async function getOneVacation(vacationId: number): Promise<VacationModel> {
    // SQL
    let sql = `SELECT * FROM vacations WHERE vacationId = ?`;

    // Get vacations
    let vacations = await dal.execute(sql, [vacationId]);

    // Get the vacation we need
    let vacation = vacations[0];

    vacation = {... vacation, imageUrl: `${appConfig.domainName}/api/vacations/${vacation.imageName}`};

    // Verify that the vacation actually exists
    if(!vacation) throw new ResourceNotFoundError(vacationId);

    return vacation;
}

async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();

    // Save the image: 
    let imageName = await imageHelper.saveImage(vacation.image);

    let sql = 'INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)';

    let info: OkPacket = await dal.execute(sql, [vacation.description, vacation.description, vacation.startDate, vacation.endDate
    , vacation.price, imageName]);

    // Get the vacation ID
    vacation.vacationId = info.insertId;

    // Get the image URL
    vacation.imageUrl = `${appConfig.domainName}/api/vacations/${imageName}`;

    // Remove image from vacation
    delete vacation.image;

    return vacation;
}

async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();

    let sql = "", imageName = "";
    let info: OkPacket;
    const oldImage = await getOldImage(vacation.vacationId);

    // If we need to update the image or not
    if(vacation.image) {
        imageName = await imageHelper.updateImage(vacation.image, oldImage);
        sql = 'UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE vacationId = ?';
        info = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate
            , vacation.price, imageName, vacation.vacationId]);
    }
    else {
        imageName = oldImage;
        sql = 'UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ? WHERE vacationId = ?';
        info = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate
            , vacation.price, vacation.vacationId]);
    }

    // If vacation doesn't exist:
    if (info.affectedRows === 0) throw new ResourceNotFoundError(vacation.vacationId);

    // Get vacation URL
    vacation.imageUrl = `${appConfig.domainName}/api/vacations/${imageName}`;

    // Remove the image from the vacation
    delete vacation.image;

    return vacation;
}

async function deleteVacation(vacationId: number): Promise<void> {

    // Get old image: 
    let oldImage = await getOldImage(vacationId);

    // Delete the image: 
    await imageHelper.deleteImage(oldImage);

    let sql = 'DELETE FROM vacations WHERE vacationId = ?';
    let info: OkPacket = await dal.execute(sql, [vacationId]);
    if(info.affectedRows === 0) throw new ResourceNotFoundError(vacationId);
}

// Get image name: 
async function getOldImage(id: number): Promise<string> {
    const sql = `SELECT imageName FROM vacations WHERE vacationId = ${id}`;
    const products = await dal.execute(sql);
    const product = products[0];
    if (!product) return null;
    const imageName = product.imageName;
    return imageName;
}


export default {
    getAllVacations,
    getOneVacation,
    addVacation,
    deleteVacation,
    updateVacation,
};

