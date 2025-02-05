import mongoose from "mongoose";

export interface IMilestone {
    taskId:mongoose.Types.ObjectId,
    freelancerId:mongoose.Types.ObjectId,
    title: string,
    budget: number,
    milestones: 
       { title:string,
        description: string,
        dueDate: Date,
        cost: number}[],
    
}

