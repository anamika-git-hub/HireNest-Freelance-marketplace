import mongoose from "mongoose";

export interface IMilestone {
    _id:string;
    title: string;
    description: string;
    dueDate: Date;
    cost: number;
    status: "active" | "unpaid" | "completed" |"review"; 
}

export interface IContract {
    bidId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    freelancerId: string;
    clientId:string;
    title: string;
    budget: number;
    description: string;
    status: "pending" | "accepted" | "rejected";
    startDate: Date;
    milestones: IMilestone[]; 
}
