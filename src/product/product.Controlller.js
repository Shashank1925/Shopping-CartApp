import { addNewProduct, updateProductRepo, deleteProductRepo, getProductRepo, getFilteredProductsRepo, postRatingRepo, reviewProductRepo, deleteReviewRepo } from "./product.Repository.js";
import ErrorHandler from "../Middlewares/error.Middleware.js";
// This is the controller function for adding a new product to the database with the given name, description, price, and category
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            throw new ErrorHandler("Please fill all the fields", 400);
        }
        const product = await addNewProduct(name, description, price, category);
        res.status(201).json({
            status: `${product.name} added successfully`,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
// This is the controller function for updating a product in the database with the given id, name, description, price, and category
export const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, description, price, category } = req.body;
        if (!id || !name || !description || !price || !category) {
            throw new ErrorHandler("Please fill all the fields", 400);
        }
        const updateData = {}
        if (name !== undefined) {
            updateData.name = name
        }
        if (description !== undefined) {
            updateData.description = description
        }
        if (price !== undefined) {
            updateData.price = price
        }
        if (category !== undefined) {
            updateData.category = category
        }
        const updatedProduct = await updateProductRepo(id, updateData, next);
        res.status(200).json({
            status: `${updatedProduct.name} updated successfully`,
            product: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
};
// This is the controller function for deleting a product from the database with the given id
export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new ErrorHandler("Please fill all the fields", 400);
        }
        const deletedProduct = await deleteProductRepo(id, next);
        res.status(200).json({
            status: `${deletedProduct.name} deleted successfully`,
            product: deletedProduct
        });
    } catch (error) {
        next(error);
    }
};
// This is the controller function for getting a product from the database with the given id
export const getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new ErrorHandler("Please fill all the fields", 400);
        }

        const product = await getProductRepo(id, next);
        res.status(200).json({
            status: `${product.name} fetched successfully`,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
// This is the controller function for getting a product from the database by filter price and keyword both
export const getFilteredProducts = async (req, res, next) => {
    try {
        let { keyword, category, minPrice, maxPrice, minRating, maxRating, page } = req.query;

        page = Math.max(1, parseInt(page) || 1);

        const products = await getFilteredProductsRepo(
            keyword?.trim(),
            category?.trim(),
            minPrice,
            maxPrice,
            minRating,
            maxRating,
            page,
            next
        );

        res.status(200).json({
            status: `${products.name} products fetched successfully`,
            products
        });
    } catch (error) {
        next(error);
    }
};
// This is the controller function for posting a rating for a product with the given id
export const postRating = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.userId;
        const { rating, comment } = req.body;
        if (!rating || !comment) {
            throw new ErrorHandler("Ratings and comments are required", 400);
        }
        const updatedProduct = await postRatingRepo(productId, userId, rating, comment, next);
        res.status(200).json({
            status: `${updatedProduct.name} updated successfully`,
            product: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
};
// Here is the controller function for reviewing a product with the given id
export const reviewProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        if (!productId) {
            throw new ErrorHandler("Product id is required", 400);
        }
        const userId = req.userId;
        const { review } = req.body;
        if (!review) {
            throw new ErrorHandler("Comment is required", 400);
        }
        const updatedProduct = await reviewProductRepo(productId, userId, review, next);
        res.status(200).json({
            status: `${updatedProduct.name} updated successfully`,
            product: updatedProduct.productId,
            review: updatedProduct.review
        });
    } catch (error) {
        next(error);
    }
};
// This is the controller function for deletling the review of perticualr product of review id of perticular user
export const deleteReview = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const userId = req.userId;
        const reviewId = req.query.reviewId;
        if (!productId || !userId || !reviewId) {
            throw new ErrorHandler("Product id, user id and review id are required", 400);
        }
        const updatedProduct = await deleteReviewRepo(productId, userId, reviewId, next);
        res.status(200).json({
            status: `${updatedProduct.name} updated successfully`,
            product: updatedProduct.productId,
            review: updatedProduct.reviewId
        })
    }
    catch (error) {
        next(error);
    }
};


