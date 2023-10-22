import { useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import "./AuthMenu.css";
import { authStore } from "../../../Redux/AuthState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import { NavLink } from "react-router-dom";

function AuthMenu(): JSX.Element {

    let [user, setUser] = useState<UserModel>();

    useEffect(() => {
        setUser(authStore.getState().user);
        let unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
        return unsubscribe;
    }, []);

    function logoutMe(): void {
        authService.logout();
        notifyService.success("Bye Bye !");
      }

    return (
        <div className="AuthMenu">
		{!user && (
        <div>
          <span className="hello-user">Hello Dear User ! {" "}</span>
          <NavLink to="/login" className="btn btn-outline-primary">Login</NavLink>
        </div>
      )}

      {user && (
        <div>
          <span className="hello-user">
            Hello {user.firstName} {user.lastName} {"  "}
          </span>
          <NavLink to="/home" className="btn btn-outline-primary " onClick={logoutMe}>
            Logout
          </NavLink>
        </div>
      )}
        </div>
    );
}

export default AuthMenu;
