import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import ErrorHandler from './src/Middlewares/error.Middleware.js';
import userRouter from './src/users/user.Router.js';
import productRouter from './src/product/product.Route.js';
import adminRouter from './src/admin/admin.Route.js';
const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/api/storefleet/user", userRouter)
server.use("/api/storefleet/product", productRouter);
server.use("/api/storefleet/user/admin", adminRouter);
// This is a global error handler that will be called if any error occurs in the application
server.use(ErrorHandler.globalErrorHandler);
server.listen(process.env.PORT, async (err) => {
    if (err) {
        console.log(`server failed with error ${err}`);
    } else {
        await connectDB();
        console.log(`server is running at http://localhost:${process.env.PORT}`);
    }
});