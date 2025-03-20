import { getAllUsers, registerAdmin, loginAdminRepo, getUserRepo, deleteUserRepo, updateUserRoleRepo } from './admin.Repository.js';
import ErrorHandler from "../Middlewares/error.Middleware.js";
import sendWelcomeEmail from "../utility/nodemailer.js";
// This is register admin
export const registerAdminController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            throw new ErrorHandler("Name is required", 400);
        }
        if (!email) {
            throw new ErrorHandler("email  is required", 400);
        }
        if (!password) {
            throw new ErrorHandler("password required", 400);
        }
        const admin = await registerAdmin(name, email, password, next);
        await sendWelcomeEmail({
            to: email,
            subject: "Welcome to the App 🎉",
            html: `<h2>Hi ${name}, Welcome!</h2><p>You are authorized to access the routes. Email:${email} Password:${password}</p>`,
            attachments: "",
        }, next);

        res.status(201).json({
            admin: admin,
            status: `${name} is registered successfully`
        })
    }
    catch (error) {
        next(error);
    }
};
// This is about admin to login by which token will generate and will use the secure routes
export const loginAdminController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ErrorHandler("Email and password are required", 404);
        }
        const loggedInAdmin = await loginAdminRepo(email, password, next);
        if (!loggedInAdmin) {
            throw new ErrorHandler("No details found", 400);
        }
        res.status(200).json({
            token: loggedInAdmin.token,
            status: `${email}Logged in successfully`
        });
    }
    catch (error) {
        next(error);
    }
}
// This is about admin who is authorized to get all users details
export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await getAllUsers(next);
        if (!users) {
            throw new ErrorHandler("No users found", 404);
        }
        res.status(200).json({
            users: users
        })
    }
    catch (error) {
        next(error);
    }
};
// This is about admin who is authorized to get a user details
export const getUserController = async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await getUserRepo(id, next);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json({
            user_Name: user.name,
            user_Email: user.email,

        })
    }
    catch (error) {
        next(error);
    }
};
// This is about admin who is authorized to get a user details
export const deleteUserController = async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await deleteUserRepo(id, next);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json({
            status: "User deleted successfully"
        })
    }
    catch (error) {
        next(error);
    }
};
// This is about to update the user profile and role from user to admin
export const updateUserRoleController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const newAdmin = await updateUserRoleRepo(userId, next);

        res.status(200).json({
            success: true,
            message: "User role updated to admin successfully",
            admin: newAdmin,
        });
    } catch (error) {
        next(error);
    }
};


