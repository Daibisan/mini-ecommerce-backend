import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import AppError from "../../utils/appError.util.js";

type Role = "ADMIN" | "USER";

const createToken = (user_id: string, role: Role) => {
    return jwt.sign({ user_id, role }, env.JWT_SECRET, { expiresIn: "3d" });
};

export const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    // strong password?
    if (!validator.isStrongPassword(password)) {
        throw new AppError("Password not strong enough", 400);
    }

    // isEmail?
    if (!validator.isEmail(email.toLowerCase())) {
        throw new AppError("Email is not valid", 400);
    }

    // duplicate email/username?
    const emailExists = await prisma.user.findUnique({
        where: { email },
    });
    const usernameExists = await prisma.user.findUnique({
        where: { username },
    });
    if (emailExists) {
        throw new AppError("Email already in use", 409);
    }
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
