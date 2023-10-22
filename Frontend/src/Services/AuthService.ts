import axios from "axios";
import UserModel from "../Models/UserModel";
import appConfig from "../Utils/AppConfig";
import { AuthAction, AuthActionType, authStore } from "../Redux/AuthState";
import CredentialsModel from "../Models/CredentialsModel";

class AuthService {
  public async register(user: UserModel): Promise<void> {
    // Send new user to backend
    let response = await axios.post<string>(appConfig.registerUrl, user);

    // Extract the token:
    let token = response.data;

    // Send token to global state:
    let action: AuthAction = { type: AuthActionType.Register, payload: token };
    authStore.dispatch(action);
  }

  public async login(credentials: CredentialsModel): Promise<void> {
    // Send credentials to backend:
    let response = await axios.post<string>(appConfig.loginUrl, credentials);

    // Extract the token:
    let token = response.data;

    // Send token to global state :
    let action: AuthAction = { type: AuthActionType.Login, payload: token };
    authStore.dispatch(action);
  }

  //Logout:
  public logout(): void {
    // Call logout in global state :
    let action: AuthAction = { type: AuthActionType.Logout};
    authStore.dispatch(action);
  }
}

let authService = new AuthService();

export default authService;
