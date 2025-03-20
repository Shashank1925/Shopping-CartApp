import express from 'express';
import { signup, login, logout, forgotPassword, resetPassword, getUserDetailsController, updateUserDetailsController, updateProfileController } from './user.Controller.js';
import jwtAuthentication from '../Middlewares/jwtAuthentication.js';
const userRouter = express.Router();

userRouter.post("/signup", (req, res, next) => {
    signup(req, res, next);
});
userRouter.post("/login", (req, res, next) => {
    login(req, res, next);
});
userRouter.get("/logout", jwtAuthentication, (req, res, next) => {
    logout(req, res, next);
});
userRouter.post("/password/forget", jwtAuthentication, (req, res, next) => {
    forgotPassword(req, res, next);
});
userRouter.put("/password/reset/:token", jwtAuthentication, (req, res, next) => {
    resetPassword(req, res, next);
});
userRouter.get("/details", jwtAuthentication, (req, res, next) => {
    getUserDetailsController(req, res, next);
});
userRouter.put("/password/update", jwtAuthentication, (req, res, next) => {
    updateUserDetailsController(req, res, next);
});
userRouter.put("/profile/update", jwtAuthentication, (req, res, next) => {
    updateProfileController(req, res, next);
});
export default userRouter;