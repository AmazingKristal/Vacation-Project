import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import { ResourceNotFoundError } from "../3-models/client-errors";
import appConfig from "../2-utils/app-config";
import FollowersModel from "../3-models/followers-model";

async function getAllFollowers(): Promise<FollowersModel[]> {
    let sql = 'SELECT * FROM followers';
    let followers = await dal.execute(sql);
    return followers;
}

async function getFollowersByVacation(vacationId: number): Promise<FollowersModel[]> {
    let sql = 'SELECT * from followers WHERE vacationId = ?';
    let followers = await dal.execute(sql, [vacationId]);
    return followers;
}

async function addFollower(follower: FollowersModel): Promise<FollowersModel> {
    let sql = 'INSERT INTO followers VALUES(?, ?)';
    await dal.execute(sql, [follower.userId, follower.vacationId]);
    return follower;
}

async function deleteFollower(userId: number, vacationId: number): Promise<void> {
    let sql = 'DELETE FROM followers WHERE userId = ? AND vacationId = ?';
    let info: OkPacket = await dal.execute(sql, [userId, vacationId]);
    if(info.affectedRows === 0) throw new ResourceNotFoundError(userId);
}

export default {
    getAllFollowers,
    getFollowersByVacation,
    addFollower,
    deleteFollower,
};