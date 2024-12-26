import mongoose from "mongoose";

export interface ITaskSubmissionForm {
    clientId: mongoose.Types.ObjectId;
    projectName: string;
    category: string;
    timeline: string;
    skills: string[];
    rateType: "hourly" | "fixed";
    minRate: number | string;
    maxRate: number | string;
    description: string;
    attachments: String[];
}