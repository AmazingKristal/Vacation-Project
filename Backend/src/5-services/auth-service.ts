import { OkPacket } from "mysql";
import UserModel from "../3-models/user-model";
import dal from "../2-utils/dal";
import cyber from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../3-models/client-errors";
import CredentialsModel from "../3-models/credentials-model";
import RoleModel from "../3-models/role-model";

// Register a new user: 
async function register(user: UserModel): Promise<string> {

    // Validation: 
    user.validate();

    // Set "User" as role: 
    user.role = RoleModel.User;

    // Is username taken:
    if(await isUsernameTaken(user.email)) throw new ValidationError(`Email ${user.email} already taken.`);

    // SQL:
    user.password = cyber.hashPassword(user.password);
    const sql = `INSERT INTO user VALUES(DEFAULT, ?, ?, ?, ?, ?)`;
                
    // Execute: 
    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password, user.role]);

    // Set back new id:
    user.userId = info.insertId;

    // Get new token:
    const token = cyber.getNewToken(user);
    
    // Return token:
    return token;
}

// Login:
async function login(credentials: CredentialsModel): Promise<string> {

    // Validation:
    credentials.validate();

    // credentials.password = cyber.hashPassword(credentials.password);

    // SQL:
    const sql = `SELECT * FROM user WHERE 
                 email = ? AND 
                 password = ?`;

    // Execute: 
    const users = await dal.execute(sql, [credentials.email, credentials.password]);

    // Extract user: 
    const user = users[0];

    // If no such user: 
    if(!user) throw new UnauthorizedError("Incorrect username or password.");

    // Generate JWT:
    const token = cyber.getNewToken(user);

    // Return token:
    return token;
}

// Is username taken:
async function isUsernameTaken(email: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM user WHERE email = ?`; // EXISTS
    const result = await dal.execute(sql, [email]);
    const count = result[0].count;
    return count > 0;
}

export default {
    register,
    login
};
