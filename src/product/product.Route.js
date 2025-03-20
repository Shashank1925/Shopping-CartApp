import express from "express";
import { addProduct, updateProduct, deleteProduct, getProduct, getFilteredProducts, postRating, reviewProduct, deleteReview } from "./product.Controlller.js";
import jwtAuthentication from '../Middlewares/jwtAuthentication.js';
const productRouter = express.Router();
productRouter.post("/add", jwtAuthentication, (req, res, next) => {
    addProduct(req, res, next);
});
productRouter.get("/products", jwtAuthentication, getFilteredProducts);
productRouter.put("/update/:id", jwtAuthentication, (req, res, next) => {
    updateProduct(req, res, next);
});
productRouter.delete("/delete/:id", jwtAuthentication, (req, res, next) => {
    deleteProduct(req, res, next);
});
productRouter.get("/details/:id", jwtAuthentication, (req, res, next) => {
    getProduct(req, res, next);
});
productRouter.put("/rate/:productId", jwtAuthentication, postRating);
// This is the route for posting a review for a product with the given id
productRouter.post("/review/:productId", jwtAuthentication, reviewProduct);
productRouter.delete("/review/delete", jwtAuthentication, deleteReview);
export default productRouter;