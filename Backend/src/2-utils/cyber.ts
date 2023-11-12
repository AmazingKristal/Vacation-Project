import { ForbiddenError, UnauthorizedError } from "../3-models/client-errors";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Token secret key:
const tokenSecretKey = "Lior-A-Meleh";

// Create JWT token:
function getNewToken(user: UserModel): string {

    // Container for user object inside the token:
    const container = { user };

    // Expiration:
    const options = { expiresIn: "3h" };

    // Create token:
    const token = jwt.sign(container, tokenSecretKey, options);

    // Return token:
    return token;
}

// Verify legal token:
function verifyToken(token: string): void {
    
    if (!token) throw new UnauthorizedError("Can't Login please try again.");

    try {
        jwt.verify(token, tokenSecretKey);
    }
    catch (err: any) {
        throw new UnauthorizedError(err.message);
    }
}

// Verify admin role:
function verifyAdmin(token: string): void {

    // Verify legal token:
    verifyToken(token);

    // Get container: 
    const container = jwt.verify(token, tokenSecretKey) as { user: UserModel };

    // Extract user: 
    const user = container.user;

    // If not admin:
    if(user.role !== RoleModel.Admin) throw new ForbiddenError("Only accessible to admins.");
}

// Hash password: 
let hashSalt = 'SuChPaSsWoRdMuChW0W';
function hashPassword(plainText: string): string {
    if(!plainText) return null;

    // Hash with salting: 
    let hashedPassword = crypto.createHmac('sha512',hashSalt).update(plainText).digest('hex');

    return hashedPassword;
}

export default {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hashPassword,
};