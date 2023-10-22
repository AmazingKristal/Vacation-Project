import { createStore } from "redux";
import UserModel from "../Models/UserModel";
import jwtDecode from "jwt-decode";


// 1 Global State: 
export class AuthState {
    public token: string = null; // jwt
    public user: UserModel = null; // user
    public constructor() {
        this.token = localStorage.getItem('token');
        if(this.token) {
            this.user = jwtDecode<{user: UserModel}>(this.token).user;
        }
    }
}

// 2 Action Type: 

export enum AuthActionType {
    Register = 'Register',
    Login = 'Login',
    Logout = 'Logout'
}

// 3 Action: 
export interface AuthAction {
    type: AuthActionType;
    payload?: string;
}
// 4 Reducer (invoked by redux library)

export function authReducer(currentState = new AuthState() , action: AuthAction): AuthState {

    let newState = {...currentState};
    
    switch(action.type) {
        case AuthActionType.Register: // Here the payload is JWT token (string) Containing the user
        case AuthActionType.Login: // Here the payload is JWT token (string) Containing the user
            newState.token = action.payload;
            newState.user = jwtDecode<{user: UserModel}>(newState.token).user;
            localStorage.setItem('token', newState.token);
            break;
        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            localStorage.removeItem('token');
            break;
    }
    return newState;
}

// 5 Store: 
export let authStore = createStore(authReducer);