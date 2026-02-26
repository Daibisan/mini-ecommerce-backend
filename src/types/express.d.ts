import { Role } from "../generated/prisma/enums.ts";

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: string;
                role: Role
            }
        }
    }
}