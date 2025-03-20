import express from 'express';
import { getAllUsersController, registerAdminController, loginAdminController, getUserController, deleteUserController, updateUserRoleController } from "./admin.Controller.js";
import jwtAuthentication from '../Middlewares/jwtAuthentication.js';
const adminRouter = express.Router();
adminRouter.post("/register", registerAdminController);
adminRouter.post("/login", loginAdminController)
adminRouter.get("/allusers", jwtAuthentication, getAllUsersController);
adminRouter.get("/details/:userId", jwtAuthentication, getUserController);
adminRouter.delete("/delete/:userId", jwtAuthentication, deleteUserController);
adminRouter.put("/update/:userId", jwtAuthentication, updateUserRoleController);
export default adminRouter;