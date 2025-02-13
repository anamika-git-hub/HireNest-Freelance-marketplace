import mongoose from "mongoose";

export interface IContract {
    bidId:mongoose.Types.ObjectId;
    taskId:mongoose.Types.ObjectId;
    freelancerId:mongoose.Types.ObjectId;
    title: string;
    budget: number;
    description: string;
    status: "pending" | "accepted" | "rejected";
    milestones: 
       { title:string;
        description: string;
        dueDate: Date;
        cost: number}[];
    
}

