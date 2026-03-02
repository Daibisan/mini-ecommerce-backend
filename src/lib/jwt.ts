import { env } from "../config/env.js";
import { Role } from "../generated/prisma/enums.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.interface.js";

export const createToken = (user_id: string, role: Role) => {
    return jwt.sign({ user_id, role }, env.JWT_SECRET, { expiresIn: "3d" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
