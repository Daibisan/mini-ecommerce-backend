import { RequestHandler } from "express";
import AppError from "../utils/appError.util.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../lib/jwt.js";
import { JwtPayload } from "../types/jwt.interface.js";

const requireAuth: RequestHandler = async (req, res, next) => {
    // check header
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError("Unauthorized", 401);
    }

    // check auth format
    if (!authorization.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
    }

    try {
        // verify token
        const token = authorization.split(" ")[1];
        const { user_id, role }: JwtPayload = verifyToken(token);

        // verify user_id
        const user = await prisma.user.findUnique({
            where: { user_id },
            select: { user_id: true },
        });
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        // save user_id to request
        req.user = { user_id, role };
        next();
    } catch (error) {
        if (env.NODE_ENV === "development") {
            // @ts-ignore
            console.log(error.message);
        }

        throw new AppError("Unauthorized", 401);
    }
};

export default requireAuth;
