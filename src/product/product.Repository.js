import ProductModel from "./product.Schema.js";
import ErrorHandler from "../Middlewares/error.Middleware.js";
// Add a new product to the database with the given name, description, price, and category
export const addNewProduct = async (name, description, price, category) => {
    try {
        const newProduct = new ProductModel({ name, description, price, category });
        if (!newProduct) {
            throw new ErrorHandler("Product not created", 400);
        }
        await newProduct.save();
        return newProduct;
    }
    catch (error) {
        throw error;
    }
};

// this is the repository function for updating a product in the database with the given id, name, description, price, and category
export const updateProductRepo = async (id, updateData, next) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!updatedProduct) {
            throw new ErrorHandler("Product not found", 404);
        }
        return updatedProduct;
    } catch (error) {
        next(error);
    }
};
// This is the repository function for deleting a product from the database with the given id
export const deleteProductRepo = async (id, next) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new ErrorHandler("Product not found", 404);
        }
        return deletedProduct;
    } catch (error) {
        next(error);
    }
};
// This is the repository function for getting a product from the database with the given id
export const getProductRepo = async (id, next) => {
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new ErrorHandler("Product not found", 404);
        }
        return product;
    } catch (error) {
        next(error);
    }
};
// This is the repository function for getting a product from the database by filter keywords and price
export const getFilteredProductsRepo = async (keyword, category, minPrice, maxPrice, minRating, maxRating, page, next) => {
    try {
        const pageSize = 2;
        const skip = (Math.max(1, page) - 1) * pageSize;

        let pipeline = [];

        if (keyword) {
            pipeline.push({
                $match: { name: { $regex: keyword, $options: "i" } }
            });
        }
        if (category) {
            pipeline.push({
                $match: { category }
            });
        }
        if (minPrice || maxPrice) {
            let priceFilter = {};
            if (minPrice) priceFilter.$gte = parseFloat(minPrice);
            if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

            pipeline.push({
                $match: { price: priceFilter }
            });
        }
        if (minRating || maxRating) {
            let ratingFilter = {};
            if (minRating) ratingFilter.$gte = parseFloat(minRating);
            if (maxRating) ratingFilter.$lte = parseFloat(maxRating);

            pipeline.push({
                $match: { rating: ratingFilter }
            });
        }
        let totalProductsResult = await ProductModel.aggregate([
            ...pipeline,
            { $count: "totalProducts" }
        ]);
        let totalProducts = totalProductsResult.length ? totalProductsResult[0].totalProducts : 0;
        let totalPages = Math.ceil(totalProducts / pageSize);

        pipeline.push({ $sort: { _id: 1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: pageSize });
        let products = await ProductModel.aggregate(pipeline);

        if (!keyword && !category && !minPrice && !maxPrice && !minRating && !maxRating) {
            products = await ProductModel.find().sort({ _id: 1 }).skip(skip).limit(pageSize);
            totalProducts = await ProductModel.countDocuments();
            totalPages = Math.ceil(totalProducts / pageSize);
        }

        if (!products.length) {
            return next(new ErrorHandler(`No products found on page ${page}`, 404));
        }

        return {
            totalProducts,
            totalPages,
            currentPage: page,
            pageSize,
            products
        };
    } catch (error) {
        return next(error);
    }
};
// Here is the repository function for posting and updating ratings along with comments in a perticular product
export const postRatingRepo = async (productId, userId, rating, comment, next) => {
    try {
        const product = await ProductModel.findOne({
            _id: productId,
            "ratings.userId": userId,
        });

        if (product) {
            await ProductModel.updateOne(
                { _id: productId, "ratings.userId": userId },
                { $set: { "ratings.$.rating": rating, "ratings.$.comment": comment } }
            );
        } else {
            await ProductModel.findByIdAndUpdate(
                productId,
                { $push: { ratings: { userId, rating, comment } } },
                { new: true, runValidators: true }
            );
        }

        return {
            message: "Rating and comment posted successfully",
            rating,
            comment,
            userId,
            productId
        };
    } catch (error) {
        next(error);
    }
};
// This is the repository function for reviewing the product with the given id
export const reviewProductRepo = async (productId, userId, review, next) => {
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ErrorHandler("Product not found", 404);
        }
        const reviewIndex = product.reviews.findIndex((r) => r.userId.toString() === userId);
        if (reviewIndex !== -1) {
            product.reviews[reviewIndex].review = review;
        } else {
            product.reviews.push({ userId, review });
        }
        await product.save();
        return {
            message: "Review posted successfully",
            review,
            userId,
            productId
        };
    } catch (error) {
        next(error);
    }
};
// Here is the repository function for deleting the perticular review of a perticular product
export const deleteReviewRepo = async (productId, userId, reviewId, next) => {
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ErrorHandler("Product not found", 404);
        }
        const reviewIndex = product.reviews.findIndex((r) => r._id.toString() === reviewId);
        if (reviewIndex === -1) {
            throw new ErrorHandler("Review not found", 404);
        }
        if (product.reviews[reviewIndex].userId.toString() !== userId) {
            throw new ErrorHandler("You are not authorized to delete this review", 403);
        }
        product.reviews.splice(reviewIndex, 1);
        await product.save();
        return {
            message: "Review deleted successfully",
            productId,
            userId,
            reviewId
        }
    } catch (error) {
        next(error);
    }
}