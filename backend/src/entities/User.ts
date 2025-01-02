import mongoose from "mongoose";

export interface Iuser {
    id?: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer' | 'admin';
    isBlocked?: boolean;
    isVerified?: boolean; 
    googleSignUp: boolean;
}