import axios from "axios";
import appConfig from "../Utils/AppConfig";
import FollowersModel from "../Models/FollowersModel";
import { FollowersAction, FollowersActionType, FollowersStore } from "../Redux/FollowersState";

class FollowersService {

    public async getAllFollowers(): Promise<FollowersModel[]> {
        let followers = FollowersStore.getState().Followers;

        if(followers.length === 0) {

            let response = await axios.get<FollowersModel[]>(appConfig.followersUrl);

            followers = response.data;

            let action: FollowersAction = {
                type: FollowersActionType.setFollowers,
                payload: followers,
            };
            FollowersStore.dispatch(action);
        }
        return followers;
    }

    public async getFollowersByVacation(vacationId: number): Promise<FollowersModel[]> {
        let response = await axios.get<FollowersModel[]>(appConfig.followersByVacUrl + vacationId);
        let followers = response.data;
        return followers;
    }

    public async addFollowers(follower: FollowersModel): Promise<void> {

       let response = await axios.post<FollowersModel>(appConfig.followersUrl, follower);

       let addedFollower = response.data;

       let action: FollowersAction = {
        type: FollowersActionType.AddFollower,
        payload: addedFollower
       };

       FollowersStore.dispatch(action);
    }

    public async deleteFollower(userId: number, vacationId: number): Promise<void> {
        await axios.delete(appConfig.followersUrl + userId + " / " + vacationId);

        let action: FollowersAction = {
            type: FollowersActionType.DeleteFollower,
            payload: {userId, vacationId},
        };

        FollowersStore.dispatch(action);
    }
}

let followersService = new FollowersService();

export default followersService;