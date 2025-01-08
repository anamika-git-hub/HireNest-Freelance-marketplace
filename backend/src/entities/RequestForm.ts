import mongoose from "mongoose";

export interface IRequest {
    freelancerId:mongoose.Types.ObjectId;
    requesterId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
}