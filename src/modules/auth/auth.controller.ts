import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import validator from "validator";
import { createUser, loginUser } from "./auth.service.js";
import { ApiResponse } from "../../types/api.interface.js";
import { LoginBody, RegisterBody } from "../../types/auth.interface.js";

export const register: RequestHandler<{}, ApiResponse> = async (req, res) => {
    const { username, email, password }: RegisterBody = req.body;

    // empty payload?
    if (!username || !email || !password) {
        throw new AppError("All fields must be filled", 400);
    }

    // strong password?
    if (!validator.isStrongPassword(password)) {
        throw new AppError("Password not strong enough", 400);
    }

    // isEmail?
    if (!validator.isEmail(email.toLowerCase())) {
        throw new AppError("Email is not valid", 400);
    }

    const newUser = await createUser(username, email, password);

    res.status(201).json({
        success: true,
        data: newUser,
    });
};

export const login: RequestHandler<{}, ApiResponse> = async (req, res) => {
    const { identifier, password }: LoginBody = req.body;

    // empty payload?
    if (!identifier || !password) {
        throw new AppError("All fields must be filled", 400);
    }

    const authenticatedUser = await loginUser(identifier, password);

    res.status(200).json({
        success: true,
        data: authenticatedUser,
    });
};
