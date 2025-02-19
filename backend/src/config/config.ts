import dotenv from 'dotenv';

dotenv.config();

export const Config = {
    PORT: process.env.PORT ,
    DB_URI: process.env.DB_URI ,
    JWT_SECRET: process.env.JWT_SECRET ,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
}