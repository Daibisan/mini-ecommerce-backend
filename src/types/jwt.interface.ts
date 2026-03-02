import { Role } from "../generated/prisma/enums.js";

export interface JwtPayload {
    user_id: string;
    role: Role;
}