import Joi from "joi";
import { ValidationError } from "./client-errors";

class UserModel {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role?: number;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        if(user.role) {
            this.role = user.role;
        }
    }

    private static validationSchema = Joi.object({
        userId: Joi.number().optional().positive().integer(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(50),
        email: Joi.string().required().min(2).max(50),
        password: Joi.string().required().min(8).max(40),
    });

    public validate(): void {
        let result = UserModel.validationSchema.validate(this);
        if(result.error?.message) throw new ValidationError(result.error.message);
    }
}

export default UserModel;