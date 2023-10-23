import { NavLink } from "react-router-dom";
import "./Menu.css";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import { useState, useEffect } from "react";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";

function Menu(): JSX.Element {

    let [user, setUser] = useState<UserModel>();

    useEffect(() => {
        setUser(authStore.getState().user);
        let unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
        return unsubscribe;
    }, []);

  return (
    <div className="Menu">
      <nav className="navbar bg-dark fixed-top" data-bs-theme="dark">
        <div className="links-box">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link" aria-current="page">Home</NavLink>
            </li>
            {(user?.role === 1) &&  <li className="nav-item">
            <NavLink to="/list" className="nav-link">List</NavLink>
            </li>}
            {(user?.role === 1) && <li className="nav-item">
            <NavLink to="/insert" className="nav-link">Insert</NavLink>
            </li>}
          </ul>
        </div>
        <div className="auth-box">
          <AuthMenu></AuthMenu>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
