import mongoose from "mongoose";

export interface Iuser {
    freelancerId:mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    id?: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer' | 'admin';
    isBlocked?: boolean;
    isVerified?: boolean; 
    googleSignUp: boolean;
}