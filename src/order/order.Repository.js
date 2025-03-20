import OrderModel from "./order.Schema.js"
import ErrorHandler from "../Middlewares/error.Middleware.js";
// This function is used to place an order
export const placeOrderRepo = async (userId, shippingInfo, orderedItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, next) => {
    try {
        if (!userId || !shippingInfo || !orderedItems || !paymentInfo || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
            throw new ErrorHandler("Please provide all the required fields", 400);
        }
        const order = await OrderModel.create({
            user: userId,
            shippingInfo,
            orderedItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });
        return order;
    } catch (error) {
        next(error);
    }
};
// This repository function is used to get a sepcific order
export const getOrderRepo = async (userId, orderId, next) => {
    try {
        const order = await OrderModel.findById(orderId);
        if (!order) {
            throw new ErrorHandler("Order not found", 404);
        }
        if (order.user.toString() !== userId) {
            throw new ErrorHandler("You are not authorized to view this order", 403);
        }
        return order
    }
    catch (error) {
        next(error);
    }
};
// This is repository function is used to get all the orders of a user
export const getAllOrdersRepo = async (userId, next) => {
    try {
        const orders = await OrderModel.find({ user: userId });
        if (!orders) {
            throw new ErrorHandler("order is not placed", 400);
        }
        return orders
    } catch (error) {
        next(error);
    }
};
// This is repository function is used to get all the orders of all users
export const getAllUsersOrdersRepo = async (next) => {
    try {
        const orders = await OrderModel.find();
        if (!orders) {
            throw new ErrorHandler("order is not placed", 400);
        }
        return orders
    } catch (error) {
        next(error);
    }
};
// Here is the repository function for updating the order status
export const updateOrderStatusRepo = async (orderId, status, next) => {
    try {
        const order = await OrderModel.findById(orderId);
        if (!order) {
            throw new ErrorHandler("Order not found", 404);
        }
        order.status = status;
        await order.save();
        return order;
    }
    catch (error) {
        next(error);
    }
}
