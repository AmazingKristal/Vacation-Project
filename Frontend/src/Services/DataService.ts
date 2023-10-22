import axios from "axios";
import VacationsModel from "../Models/VacationsModel";
import appConfig from "../Utils/AppConfig";
import {
  VacationStore,
  VacationsAction,
  VacationsActionType,
} from "../Redux/VacationsState";
import { authStore } from "../Redux/AuthState";

class DataService {
  public async getAllVacations(): Promise<VacationsModel[]> {
    // get the vacations from the global state
    let vacations = VacationStore.getState().vacations;

    // if there is nothing in the global state then we get it from the backend
    if (vacations.length === 0) {
      let response = await axios.get<VacationsModel[]>(appConfig.vacationsUrl);

      vacations = response.data;

      let action: VacationsAction = {
        type: VacationsActionType.setVacations,
        payload: vacations,
      };
      // put the vacations in the global state
      VacationStore.dispatch(action);
    }
    return vacations;
  }

  public async getOneVacation(vacationId: number): Promise<VacationsModel> {
    // get the vacations from the global state
    let vacations = VacationStore.getState().vacations;

    // Find the vacation we want:
    let vacation = vacations.find((v) => v.vacationId === vacationId);

    // If no vacation is found :
    if (!vacation) {
      let response = await axios.get<VacationsModel>(
        appConfig.vacationsUrl + vacationId
      );

      vacation = response.data;
    }
    return vacation;
  }

  public async addVacation(vacation: VacationsModel): Promise<void> {
    // We need additional data to send so we can include files:
    
    let options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authStore.getState().token,
        },
      };

    let response = await axios.post<VacationsModel>(
      appConfig.addVacationsUrl,
      vacation,
      options
    );

    let addedVacation = response.data;

    // Add the vacation to the global state:
    let action: VacationsAction = {
      type: VacationsActionType.AddVacation,
      payload: addedVacation,
    };

    VacationStore.dispatch(action);
  }
  public async updateVacation(vacation: VacationsModel): Promise<void> {
    // We need additional data to send so we can include files:
    let options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + authStore.getState().token,
      },
    };
    let response = await axios.put<VacationsModel>(
      appConfig.updateVacationsUrl + vacation.vacationId,
      vacation,
      options
    );
    
    let updatedVacation = response.data;

    // Add the updated vacation to global state :
    let action: VacationsAction = {
      type: VacationsActionType.UpdateVacation,
      payload: updatedVacation,
    };

    VacationStore.dispatch(action);
  }

  public async deleteVacation(vacationId: number): Promise<void> {
    // Delete the vacation from the backend :
    let options = {
      headers: { Authorization: "Bearer " + authStore.getState().token },
    };
    await axios.delete(appConfig.vacationsUrl + vacationId, options);

    // delete the vacation from the global state:
    let action: VacationsAction = {
      type: VacationsActionType.DeleteVacation,
      payload: vacationId,
    };

    VacationStore.dispatch(action);
  }
}

const dataService = new DataService();

export default dataService;
