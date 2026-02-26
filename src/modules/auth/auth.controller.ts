import { RequestHandler } from "express";
import AppError from "../../utils/appError.util.js";
import { createUser, loginUser } from "./auth.service.js";

interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

interface LoginBody {
    identifier: string;
    password: string;
}

export const register: RequestHandler = async (req, res) => {
    const { username, email, password }: RegisterBody = req.body;

    // check empty input
    if (!username || !email || !password) {
        throw new AppError("All fields must be filled", 400);
    }

    const newUser = await createUser(username, email, password);

    res.status(201).json({
        data: newUser,
    });
};

export const login: RequestHandler = async (req, res) => {
    const { identifier, password }: LoginBody = req.body;

    // check empty input
    if (!identifier || !password) {
        throw new AppError("All fields must be filled", 400);
    }

    const authenticatedUser = await loginUser(identifier, password);

    res.status(200).json({
        data: authenticatedUser,
    });
};
