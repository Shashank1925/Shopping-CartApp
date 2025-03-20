// This is about admin who is authorized to get all users details
import ErrorHandler from "../Middlewares/error.Middleware.js";
import UserModel from "../users/user.Schema.js";
import AdminModel from "./admin.Schema.js";
import jwtGeneration from "../Middlewares/jwtGeneration.js";
import { hashPassword, compareHashedPassword } from "../utility/bcryptPassword.js";
// This is register admin
export const registerAdmin = async (name, email, password, next) => {
    try {
        if (!name || !email || !password) {
            throw new ErrorHandler("All fields are required", 400);
        }
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            throw new ErrorHandler("Admin already exists", 400);
        }
        else {
            password = await hashPassword(password, next);
            const admin = await AdminModel.create({
                name, email, password
            });
            const adminDetails = await AdminModel.findById(admin._id).select("-password");
            return adminDetails;
        }
    }
    catch (error) {
        next(error);
    }
};
// Here is the repository for admin to login 
export const loginAdminRepo = async (email, password, next) => {
    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            throw new ErrorHandler("Admin not found", 404);
        }
        const isPasswordValid = await compareHashedPassword(password, admin.password, next);
        if (!isPasswordValid) {
            throw new ErrorHandler("Invalid password", 400);
        }
        const token = jwtGeneration({ email, id: admin._id }, next);
        admin.tokens.push(token);
        admin.save();
        return { admin, token };
    } catch (error) {
        next(error);
    }
}






// This is about admin who is authorized to get all users details
export const getAllUsers = async (next) => {
    try {
        const users = await UserModel.find({});
        if (!users) {
            throw new ErrorHandler("No users found", 404);
        }
        return users;
    }
    catch (error) {
        next(error);
    }
};
// This is about admin who is authorized to get a user perticular user
export const getUserRepo = async (id, next) => {
    try {
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        return user;
    }
    catch (error) {
        next(error);
    }
};
// This is about admin who is authorized to delete a user
export const deleteUserRepo = async (id, next) => {
    try {
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        return true;
    } catch (error) {
        next(error);
    }
};
// This is about to update the user profile and role from user to admin
export const updateUserRoleRepo = async (id, next) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        await UserModel.findByIdAndDelete(id);
        const newAdmin = await AdminModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        return newAdmin;
    } catch (error) {
        next(error);
    }
};
