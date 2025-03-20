import ErrorHandler from "../Middlewares/error.Middleware.js";
import { placeOrderRepo, getOrderRepo, getAllOrdersRepo, getAllUsersOrdersRepo, updateOrderStatusRepo } from "./order.Repository.js";
import AdminModel from "../admin/admin.Schema.js";
export const placeOrderController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { shippingInfo, orderedItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!shippingInfo || !orderedItems || !paymentInfo || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
            return next(new ErrorHandler("All order details are required", 400));
        }

        const order = await placeOrderRepo(userId, shippingInfo, orderedItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, next);

        if (!order) return;
        res.status(201).json({
            status: "Order placed successfully",
            order
        });

    } catch (error) {
        next(error);
    }
};
// This is controller function for getting a specific order
export const getOrderController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const orderId = req.params.orderId;
        const order = await getOrderRepo(userId, orderId, next);
        if (!order) return;
        res.status(200).json({
            status: "Order fetched successfully",
            order
        })
    } catch (error) {
        next(error);
    }
};
// This is controller function for getting all the orders of a user
export const getAllOrdersController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const orders = await getAllOrdersRepo(userId, next);
        if (!orders) return;
        res.status(200).json({
            status: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        next(error);
    }
};
// This controller function is uset to get all the orders of all users
export const getAllUsersOrdersController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            new ErrorHandler("You are not authorized to view this page", 403);
        }
        // This ensures only Admin can see the all orders of all users
        const admin = await AdminModel.findById(userId);
        if (!admin) {
            return next(new ErrorHandler("You are not authorized to view this page", 403));
        }

        const orders = await getAllUsersOrdersRepo(next);
        if (!orders) {
            return next(new ErrorHandler("No orders found", 404));
        } res.status(200).json({
            status: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        next(error);
    }
};
// This is the controler function for updating the order status
export const updateOrderStatusController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            new ErrorHandler("You are not authorized to view this page", 403);
        }
        const admin = await AdminModel.findById(userId);
        if (!admin) {
            return next(new ErrorHandler("You are not authorized to view this page", 403));
        }
        const orderId = req.params.orderId;
        const { status } = req.body;
        const order = await updateOrderStatusRepo(orderId, status, next);
        if (!order) {
            new ErrorHandler("Order not found", 404);
        }
        res.status(200).json({
            status: "Order status updated",
            order
        })
    } catch (error) {
        next(error);
    }
}
