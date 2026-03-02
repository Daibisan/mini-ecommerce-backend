import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import validator from "validator";
import AppError from "../../utils/appError.util.js";
import { createToken } from "../../lib/jwt.js";

export const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    // duplicate email?
    const emailExists = await prisma.user.findUnique({
        where: { email },
    });
    if (emailExists) {
        throw new AppError("Email already in use", 409);
    }
    
    // duplicate username?
    const usernameExists = await prisma.user.findUnique({
        where: { username },
    });
    if (usernameExists) {
        throw new AppError("Username already in use", 409);
    }

    const salt = await bcrypt.genSalt(11);
    const password_hash = await bcrypt.hash(password, salt);

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
