import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../utils/appError.util.js";
import { env } from "../config/env.js";
import { ApiResponse, ValidationErrorItem } from "../types/api.interface.js";

export const globalErrorHandler: ErrorRequestHandler<{}, ApiResponse> = (
    err,
    _req,
    res,
    _next,
) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: ValidationErrorItem[] | undefined;

    // 1. Error Validasi Zod
    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
        }));
    }
    // 2. Custom App Error (Operational Error)
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // 3. Error parsing JSON body bawaan express.json()
    else if (
        err instanceof SyntaxError &&
        "status" in err &&
        err.status === 400
    ) {
        statusCode = 400;
        message = "Invalid JSON payload";
    }

    // Log error di mode non-production untuk debugging
    if (env.NODE_ENV !== "production" && statusCode === 500) {
        console.error("UNHANDLED_ERROR:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};
