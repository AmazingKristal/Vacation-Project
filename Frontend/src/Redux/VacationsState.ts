import { createStore } from "redux";
import VacationsModel from "../Models/VacationsModel";


// 1. Global State: 
class VacationsState {
    public vacations: VacationsModel[] = []; // Init with empty array;
}

// 2. Action Type.
export enum VacationsActionType {
    setVacations = 'SetVacations',
    AddVacation = 'AddVacation',
    UpdateVacation = 'UpdateVacation',
    DeleteVacation = 'DeleteVacation'
}

// 3. Action : 

export interface VacationsAction {
    type: VacationsActionType; // Action Type
    payload: any // The data related to the action.
}

// 4. Reducer(invoked by redux library): 
export function VacationsReducer(currentState = new VacationsState(), action: VacationsAction): VacationsState {
    let newState = {...currentState}; // Duplicate the global state.

    // Change the duplicated global state according to the action: 
    switch(action.type) {

        case VacationsActionType.setVacations: // Here the payload is Vacations array
            newState.vacations = action.payload; // Save all Vacations into global state
            break;
        
        case VacationsActionType.AddVacation: // Here the payload is a single Vacation.
            newState.vacations.push(action.payload); // Add that Vacation into global state.
            break;
        case VacationsActionType.UpdateVacation: // Here the payload is a single Vacation to update.
            let indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.vacationId);
            console.log(indexToUpdate);
            if(indexToUpdate >= 0) newState.vacations[indexToUpdate] = action.payload;
            break;
        case VacationsActionType.DeleteVacation: // Here the payload is a single id
            let indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload);
            if(indexToDelete >= 0) newState.vacations.splice(indexToDelete, 1);
            break;

    }
    return newState; // Return the changed duplicated global state.
}

// 5. Store: 
export let VacationStore = createStore(VacationsReducer);