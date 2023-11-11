import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Login.css";

function Login(): JSX.Element {
  let { register, handleSubmit } = useForm<CredentialsModel>();

  let navigate = useNavigate();

  async function send(credentials: CredentialsModel) {
    try {
      await authService.login(credentials);
      notifyService.success("You have been successfully logged in.");
      navigate("/home");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="Login">
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit(send)}>
        <label>Email: </label>
        <input type="email" {...register("email")} required/>

        <label>Password: </label>
        <input type="password" {...register("password")} required min={4}/>

        <button>Login</button>

        <div className="register-box">
        <span>No account yet ? </span>
        <NavLink to="/register">
            Register
        </NavLink>
        </div>
      </form>
    </div>
  );
}

export default Login;
