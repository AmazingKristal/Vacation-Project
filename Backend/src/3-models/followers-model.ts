import Joi from "joi";
import { ValidationError } from "./client-errors";

class FollowersModel {
    userId: number;
    vacationId: number;

    public constructor(follower: FollowersModel) {
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }

        private static validationSchema = Joi.object({
            userId: Joi.number().required().positive().integer(),
            vacationId: Joi.number().required().positive().integer()
        });

        public validate(): void {
            let result = FollowersModel.validationSchema.validate(this);
            if(result.error?.message) throw new ValidationError(result.error.message);
        }
}

export default FollowersModel;