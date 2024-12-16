import mongoose, { Schema } from "mongoose";
import { ITaskSubmissionForm } from "../../entities/Tasks";

const TaskSubmissionSchema = new Schema<ITaskSubmissionForm>({
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
        type: Schema.Types.Mixed, 
        required: true
    },
    maxRate: {
        type: Schema.Types.Mixed, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachments: [{
        type: Schema.Types.Mixed, 
        required: false
    }]
}, { timestamps: true });

export const TaskSubmissionModel = mongoose.model<ITaskSubmissionForm>('TaskSubmission', TaskSubmissionSchema);
