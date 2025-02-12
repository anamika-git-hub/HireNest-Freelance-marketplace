import mongoose, { Schema } from "mongoose";
import { ITaskSubmissionForm } from "../../entities/Tasks";

const TaskSubmissionSchema = new Schema<ITaskSubmissionForm>({
    clientId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    projectName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    rateType: {
        type: String,
        enum: ['hourly', 'fixed'],
        required: true
    },
    minRate: {
        type: Number, 
        required: true
    },
    maxRate: {
        type:Number, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachments: [{
        type: Schema.Types.Mixed, 
        required: false
    }],
    status: {
        type: String,
        enum: ['pending','onhold','ongoing','completed'],
        default: 'pending'
    },
}, { timestamps: true });

export const TaskSubmissionModel = mongoose.model<ITaskSubmissionForm>('TaskSubmission', TaskSubmissionSchema);
