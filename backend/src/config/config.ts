import dotenv from 'dotenv';

dotenv.config();

export const Config = {
    PORT: process.env.PORT ,
    DB_URI: process.env.DB_URI ,
    JWT_SECRET: process.env.JWT_SECRET 
}