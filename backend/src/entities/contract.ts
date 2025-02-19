import mongoose from "mongoose";

export interface IMilestone {
    title: string;
    description: string;
    dueDate: Date;
    cost: number;
    status: "active" | "unpaid" | "completed"; 
}

export interface IContract {
    bidId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    title: string;
    budget: number;
    description: string;
    status: "pending" | "accepted" | "rejected";
    startDate: Date;
    milestones: IMilestone[]; 
}
