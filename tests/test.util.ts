import { createToken } from "../src/lib/jwt.js";
import { ADMIN_ID } from "./test.config.js";

export const getAdminToken = () => {
    return createToken(ADMIN_ID, 'ADMIN');
}

export const getRandomText = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export const seed = {
    username: () => `user_${getRandomText()}`,
    email: () => `${getRandomText()}@gmail.com`,
    categoryName: () => `Category-${getRandomText()}`,
    productName: () => `Product-${getRandomText()}`,
    // Password untuk Register (lolos validasi regex biasanya)
    password: "12345678Password.!", 
    // Password untuk Login (yang kita simpan di DB saat seeding)
    defaultUserPassword: "12345678User.!"
};