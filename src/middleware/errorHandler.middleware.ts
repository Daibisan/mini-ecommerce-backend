import { ErrorRequestHandler } from "express";
import AppError from "../utils/appError.util.js";
import { env } from "../config/env.js";
import { ApiResponse } from "../types/api.interface.js";

export const errorHandler: ErrorRequestHandler<{}, ApiResponse> = (err, req, res, next) => {
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
        success: false,
        error: message,
    });
}