import bcrypt from 'bcrypt';
import ErrorHandler from '../Middlewares/error.Middleware.js';
export const hashPassword = async (password, next) => {
    try {
        if (!password) throw new ErrorHandler('Password is required', 400);
        return await bcrypt.hash(password, 12);
    } catch (error) {
        next(error)
    }
};
export const compareHashedPassword = async (password, hashPassword, next) => {
    try {
        if (!password) throw new ErrorHandler('Password is required', 400);
        if (!hashPassword) throw new ErrorHandler('Hash password is required', 400);
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        next(error)
    }
};