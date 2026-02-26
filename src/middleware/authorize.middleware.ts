import { RequestHandler } from "express";
import { Role } from "../generated/prisma/enums.js";
import AppError from "../utils/appError.util.js";

const authorize = (...allowedRoles: Role[]): RequestHandler => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError("Forbidden", 403);
        }
        
        next();
    }
}

export default authorize;