import UserModel from "./user.Schema.js";
import ErrorHandler from "../Middlewares/error.Middleware.js";
import { hashPassword, compareHashedPassword } from "../utility/bcryptPassword.js";
import jwtGeneration from "../Middlewares/jwtGeneration.js";
import crypto from "crypto";
// This is a repository function that will be called when the user signs up
export const registerUserRepository = async (name, email, password, next) => {
    try {
        if (!name || !email || !password) {
            throw new ErrorHandler("All fields are required", 400);
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler("User already exists", 409);
        }
        else {
            password = await hashPassword(password, next);
            const newUser = new UserModel({ name, email, password });
            await newUser.save();
            return { res: newUser };
        }
    } catch (error) {
        next(error);
    }
};
// This is a repository function that will be called when the user logs in
export const loginUserRepository = async (email, password, next) => {
    try {
        if (!email || !password) {
            throw new ErrorHandler("All fields are required", 400);
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        const isMatch = await compareHashedPassword(password, user.password, next);
        if (!isMatch) throw new ErrorHandler("Password does not match", 400);
        const token = jwtGeneration({ email, id: user._id }, next);
        user.tokens.push(token);
        await user.save();
        return { success: true, res: user, token };
    } catch (error) {
        next(error);
    }
};
// This is for logout function to remove the token from the database
export const logoutUserRepository = async (email, token, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        user.tokens = user.tokens.filter(storedToken => storedToken !== token);
        await user.save();
        return { success: true, res: user };
    } catch (error) {
        next(error);
    }
};
export const generatePasswordResetToken = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return { success: false, message: "User not found" };
    }

    // Generate Reset Token using Crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    return {
        success: true,
        resetToken,
        email: user.email
    };
};
// This is a repository function that will be called when the user resets the password
export const resetPasswordRepository = async (token, newPassword, next) => {
    try {
        if (!token) {
            throw new ErrorHandler("Token is required", 400);
        }
        if (!newPassword) {
            throw new ErrorHandler("New password is required", 400);
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new ErrorHandler("Invalid or expired token", 400);
        }

        user.password = await hashPassword(newPassword, next);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return { success: true, message: "Password reset successful. You can now log in with your new password!" };

    } catch (error) {
        next(error);
    }
};
// Here is the method of getting the details of a specific user
export const getUserDetailsRepository = async (email, next) => {
    try {
        const user = await UserModel.aggregate([
            { $match: { email } },
            {
                $project: {
                    password: 0,
                    tokens: 0,
                },
            },
        ]);
        if (!user.length) {
            throw new ErrorHandler("User not found", 404);
        }
        return { success: true, res: user };
    } catch (error) {
        next(error);
    }
};
// This is a repository function that will be called when the user updates password  
export const updateUserDetailsRepository = async (email, newPassword, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        const hashedPassword = await hashPassword(newPassword, next);
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } },
            { new: true }
        ).select("-password -tokens");

        return { success: true, res: updatedUser };
    } catch (error) {
        next(error);
    }
};
// Here is the method of updating the profile name and email of a specific user
export const updateProfileRepository = async (email, newName, newEmail, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            { $set: { name: newName, email: newEmail } },
            { new: true }
        ).select("-password -tokens");
        return { success: true, res: updatedUser };
    } catch (error) {
        next(error);
    }
};

