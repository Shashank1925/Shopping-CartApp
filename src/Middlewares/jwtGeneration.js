import jwt from 'jsonwebtoken';
import ErrorHandler from './error.Middleware.js';
import dotenv from 'dotenv';
dotenv.config();
export default function jwtGeneration(info, next) {
    try {
        const { email, id } = info;
        if (!email || !id) {
            throw new ErrorHandler('User ID and email missing for token generation', 400);
        }
        const payload = {
            userId: id.toString(),
            userEmail: email
        }
        const privateKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, privateKey, { expiresIn: '24h' });
        if (!token) {
            throw new ErrorHandler('Token not found', 401);
        }
        return token;
    } catch (error) {
        return next(error);
    }
};