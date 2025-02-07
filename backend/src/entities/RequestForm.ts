import mongoose from "mongoose";
import { IFreelancerProfile } from "./freelancerProfile";

export interface IRequest {
    freelancerId:IFreelancerProfile;
    requesterId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
    status: "pending" | "accepted" | "rejected";
}