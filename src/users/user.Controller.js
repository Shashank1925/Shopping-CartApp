import UserModel from "./user.Schema.js";
import ErrorHandler from "../Middlewares/error.Middleware.js";
import { registerUserRepository, loginUserRepository, logoutUserRepository, generatePasswordResetToken, resetPasswordRepository, getUserDetailsRepository, updateUserDetailsRepository, updateProfileRepository } from "./user.Repository.js";
import sendWelcomeEmail from "../utility/nodemailer.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
// This is a controller function that will be called when the user signs up
export const signup = async (req, res, next) => {
    try {
        let { name, email, password } = req.body;
        if (!name) {
            throw new ErrorHandler("Name is required", 400);
        }
        if (!email) {
            throw new ErrorHandler("email  is required", 400);
        }
        if (!password) {
            throw new ErrorHandler("password required", 400);
        }
        const user = await registerUserRepository(name, email, password, next);
        if (!user)
            return;
        const imagePath = path.resolve('src/public/images/logo.png');
        await sendWelcomeEmail({
            to: user.res.email,
            subject: "Welcome to the App 🎉",
            html: `<h2>Hi ${user.res.name}, Welcome!</h2><p>We are excited to have you with us.</p>`,
            attachments: [
                {
                    filename: 'logo.png',
                    path: imagePath,
                    cid: 'welcomeImage',
                },
            ],
        }, next);
        res.status(201).json({
            status: `${user.res.name} is registered successfully. Addtionally,  Welcome email sent to ${user.res.email}`,
            user,
        });
    } catch (error) {
        next(error);
    }
};
// This is a controller function that will be called when the user logs in
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new ErrorHandler("email is required", 400);
        }
        if (!password) {
            throw new ErrorHandler("password required", 400);
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler("Invalid email or password", 400);
        }
        const loggedIn = await loginUserRepository(email, password, next);
        res.status(200).json({
            status: `${user.name} is logged in successfully`,
            token: loggedIn.token,
            user: loggedIn.res._id
        });
    }
    catch (error) {
        next(error);
    }
};
// This is a controller function that will be called when the user logs out
export const logout = async (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        const token = req.headers["authorization"];
        if (!token) {
            throw new ErrorHandler("Token not present", 401);
        }
        await logoutUserRepository(userEmail, token, next);
        res.status(200).json({
            status: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
// This is a controller function that will be called when the user forgets their password
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new ErrorHandler("Email is required", 400);
        }

        const result = await generatePasswordResetToken(email);
        if (!result.success) {
            throw new ErrorHandler(result.message, 404);
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${result.resetToken}`;

        // Send Reset Email
        const imagePath = path.resolve('src/public/images/logo.png');
        await sendWelcomeEmail({
            to: result.email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}" target="_blank">${resetUrl}</a>
                <p>This link is valid for only 15 minutes.</p>
                <br/>
        <img src="cid:resetImage" alt="Reset Password" width="200"/>
            `,
            attachments: [
                {
                    filename: 'reset.png',
                    path: imagePath,
                    cid: 'resetImage',
                },
            ],
        }, next);

        res.status(200).json({
            status: "Password reset email sent successfully!",
            resetToken: result.resetToken
        });

    } catch (error) {
        next(error);
    }
};
//  This is a controller function that will be called when the user resets their password
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const result = await resetPasswordRepository(token, newPassword, next);

        res.status(200).json({
            status: result.message,
        });

    } catch (error) {
        next(error);
    }
};
// This is a controller function that will be called detile of a specific user
export const getUserDetailsController = async (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        const user = await getUserDetailsRepository(userEmail, next);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json({
            status: "User details fetched successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};
// Here is the controller function that will be called when the user updates password
export const updateUserDetailsController = async (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            throw new ErrorHandler("User email is required", 400);
        }
        const { newPassword } = req.body;
        if (!newPassword) {
            throw new ErrorHandler("Password is required", 400);
        }
        const user = await updateUserDetailsRepository(userEmail, newPassword, next);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json({
            status: "User details updated successfully",
            user,
        })
    } catch (error) {
        next(error);
    }
};
// Here is the controller function that will be called when the user updates the profile name and email
export const updateProfileController = async (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        const { newName, newEmail } = req.body;
        if (!newName || !newEmail) {
            throw new ErrorHandler("Name and email are required", 400);
        }
        const user = await updateProfileRepository(userEmail, newName, newEmail, next);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json({
            status: `${user.name} profile updated successfully`,
            user: user
        })
    } catch (error) {
        next(error);
    }
}
// This is a controller function that will be called when the user updates the profile picture
