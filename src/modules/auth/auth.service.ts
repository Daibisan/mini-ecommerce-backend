import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import validator from "validator";
import AppError from "../../utils/appError.util.js";
import { createToken } from "../../lib/jwt.js";
import { Prisma } from "../../generated/prisma/client.js";

export const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    const salt = await bcrypt.genSalt(11);
    const password_hash = await bcrypt.hash(password, salt);

    try {
        const newUser = await prisma.user.create({
            data: { username, email, password_hash },
        });
        const token = createToken(newUser.user_id, newUser.role);

        return {
            token,
            user: {
                username: newUser.username,
                email: newUser.email,
            },
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // duplicate email/username
            if (error.code === "P2002") {
                const metaContent = JSON.stringify(error.meta).toLowerCase();
                
                if (metaContent.includes("email")) {
                    throw new AppError("Email already in use", 409);
                }
                if (metaContent.includes("username")) {
                    throw new AppError("Username already in use", 409);
                }
            }
        }
        throw error;
    }
};

export const loginUser = async (identifier: string, password: string) => {
    // username/email is exist?
    const isEmail = validator.isEmail(identifier);

    const user = await prisma.user.findUnique({
        where: isEmail ? { email: identifier } : { username: identifier },
    });
    if (!user) {
        throw new AppError("Invalid login credentials", 401);
    }

    // check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        throw new AppError("Invalid login credentials", 401);
    }

    const token = createToken(user.user_id, user.role);

    return {
        token,
        user: {
            username: user.username,
            email: user.email,
        },
    };
};
