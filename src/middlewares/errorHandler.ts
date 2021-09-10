/* Imported Modules */
import { Request, Response, NextFunction } from 'express';

/* Custom Imported Modules */
import ErrorResponse from '../classes/errorResponse';
import logger from '../config/logger';

/* Config Variables */
const NAMESPACE = "ErrorHandler"

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    let error: ErrorResponse = { ...err };

    error.message = err.message
    error.statusCode = err.statusCode

    if (err.code === 11000) {
        const message = "Duplicate Field Value Enter"
        error = new ErrorResponse(message, 400)
    }

    if (err.code === "EAI_AGAIN") {
        const message = "Check your internet connected properly"
        error = new ErrorResponse(message, 400)
    }

    if (err.code === "TokenExpiredError") {
        const message = "Your link expired so resent ur link"
        error = new ErrorResponse(message, 400)
    }

    if (err.code === "JsonWebTokenError") {
        const message = "Plz check valid link"
        error = new ErrorResponse(message, 400)
    }


    if (err.name === "ValidationError") {
        const message = "ValidationError"
        error = new ErrorResponse(message, 400)
    }

    logger.error(NAMESPACE, `${error.message} code:${error.code}`, error.stack)

    res.status(error.statusCode || 500)
        .json({
            success: false,
            message: error.message || "Server Error",
        })
}

export default errorHandler;