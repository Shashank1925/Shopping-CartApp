import express from 'express';
import { placeOrderController, getOrderController, getAllOrdersController, getAllUsersOrdersController, updateOrderStatusController } from './order.Controller.js';
import jwtAuthentication from '../Middlewares/jwtAuthentication.js';
const orderRouter = express.Router();
orderRouter.post("/new", jwtAuthentication, placeOrderController);
orderRouter.get("/:orderId", jwtAuthentication, getOrderController);
orderRouter.get("/my/orders", jwtAuthentication, getAllOrdersController);
orderRouter.get("/orders/placed", jwtAuthentication, getAllUsersOrdersController);
// Always put dynamic routes of same method at the bottom as  they are more specific than static routes and will cause conflicts if placed above static routes
orderRouter.put("/update/:orderId", jwtAuthentication, updateOrderStatusController);
export default orderRouter;