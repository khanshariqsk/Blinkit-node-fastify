import dotenv from "dotenv";
dotenv.config();

// Environment configuration
export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const HASH_SECRET_KEY = process.env.HASH_SECRET_KEY;
