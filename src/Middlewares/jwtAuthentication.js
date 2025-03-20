import jwt from 'jsonwebtoken';
import ErrorHandler from './error.Middleware.js';
import dotenv from 'dotenv';
dotenv.config();
const jwtAuthentication = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return next(new ErrorHandler('Token not found', 401));
        }
        const privateKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, privateKey);
        req.userId = decodedToken.userId;
        req.userEmail = decodedToken.userEmail;
        next();
    } catch (error) {
        return next(error);
    }
};
export default jwtAuthentication;