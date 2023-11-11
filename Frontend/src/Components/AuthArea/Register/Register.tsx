import { useForm } from "react-hook-form";
import UserModel from "../../../Models/UserModel";
import "./Register.css";
import notifyService from "../../../Services/NotifyService";
import authService from "../../../Services/AuthService";
import { NavLink, useNavigate } from "react-router-dom";

function Register(): JSX.Element {

    let {register, handleSubmit} = useForm<UserModel>();

    let navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            await authService.register(user);
            notifyService.success('You have been successfully registered.');
            navigate('/home');
        }

        catch(err: any) {
            notifyService.error(err);
        }
    }
    return (


        <div className="Register">
			<h2>Register</h2>

            <form onSubmit={handleSubmit(send)}>

            <label>First name: </label>
            <input type="text" {...register('firstName')} required/>

            <label>Last name: </label>
            <input type="text" {...register('lastName')} required/>

            <label>Email: </label>
            <input type="email" {...register('email')} required/>

            <label>Password: </label>
            <input type="password" {...register('password')} required min={4}/>

            <button>Register</button>

            <div className="login-box">
            <span>Already have an account ? </span>
            <NavLink to="/login">
                Login
            </NavLink>
            </div>
            
            </form>
        </div>
    );
}

export default Register;
