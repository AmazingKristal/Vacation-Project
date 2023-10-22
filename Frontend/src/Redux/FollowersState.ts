import { createStore } from "redux";
import FollowersModel from "../Models/FollowersModel";


// 1. Global State: 
class FollowersState {
    public Followers: FollowersModel[] = []; // Init with empty array;
}

// 2. Action Type.
export enum FollowersActionType {
    setFollowers = 'SetFollowers',
    AddFollower = 'AddFollower',
    DeleteFollower = 'DeleteFollower'
}

// 3. Action : 

export interface FollowersAction {
    type: FollowersActionType; // Action Type
    payload: any // The data related to the action.
}

// 4. Reducer(invoked by redux library): 
export function FollowersReducer(currentState = new FollowersState(), action: FollowersAction): FollowersState {
    let newState = {...currentState}; // Duplicate the global state.

    // Change the duplicated global state according to the action: 
    switch(action.type) {

        case FollowersActionType.setFollowers: // Here the payload is Followers array
            newState.Followers = action.payload; // Save all Followers into global state
            break;
        
        case FollowersActionType.AddFollower: // Here the payload is a single Follower.
            newState.Followers.push(action.payload); // Add that Follower into global state.
            break;
        case FollowersActionType.DeleteFollower: // Here the payload is a single id
            let {userId, vacationId} = action.payload;
            let indexToDelete = newState.Followers.findIndex(f => f.userId === userId && f.vacationId === vacationId);
            if(indexToDelete >= 0) newState.Followers.splice(indexToDelete, 1);
            break;

    }
    return newState; // Return the changed duplicated global state.
}

// 5. Store: 
export let FollowersStore = createStore(FollowersReducer);