import { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service.js";
import { ApiResponse } from "../../types/api.interface.js";
import { LoginBody, RegisterBody } from "./auth.schema.js";

export const register = async (
    req: Request<{}, {}, RegisterBody>,
    res: Response<ApiResponse>,
) => {
    const { username, email, password } = req.body;

    const newUser = await createUser(username, email, password);

    res.status(201).json({
        success: true,
        data: newUser,
    });
};

export const login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response<ApiResponse>,
) => {
    const { identifier, password } = req.body;

    const authenticatedUser = await loginUser(identifier, password);

    res.status(200).json({
        success: true,
        data: authenticatedUser,
    });
};
