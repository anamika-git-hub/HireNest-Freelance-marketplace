import mongoose from "mongoose";

export interface IBidSubmissionForm {
    taskId: mongoose.Types.ObjectId;
    bidderId:  mongoose.Types.ObjectId;
    rate: number;
    deliveryTime: number;
    timeUnit: string;
    createdAt: Date;
    status: "pending" | "accepted" | "rejected";
}
