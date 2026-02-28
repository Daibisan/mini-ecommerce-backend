import { ErrorRequestHandler } from "express";
import AppError from "../utils/appError.util.js";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (env.NODE_ENV !== "production" && message === "Internal Server Error") {
        console.log(err);
    }

    res.status(statusCode).json({
        error: message,
    });
}