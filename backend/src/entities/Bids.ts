import mongoose from "mongoose";
import { ITaskSubmissionForm } from "./Tasks";

export interface IBidSubmissionForm {
    taskId: ITaskSubmissionForm;
    bidderId:  mongoose.Types.ObjectId;
    rate: number;
    deliveryTime: number;
    timeUnit: string;
    createdAt: Date;
    status: "pending" | "accepted" | "rejected";
}
