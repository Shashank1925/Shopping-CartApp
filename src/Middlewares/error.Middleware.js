export default class ErrorHandler extends Error {
    constructor(error, statusCode) {
        super(error);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
    static globalErrorHandler(error, req, res, next) {
        if (res.headerSent) {
            return next(error);
        }
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        res.status(statusCode).json({
            success: false,
            message,
        });
    }
}