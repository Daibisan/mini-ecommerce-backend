import "dotenv/config";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
if (!process.env.PORT) {
    throw new Error("PORT is not defined");
}
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}
if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
}

export const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
};
