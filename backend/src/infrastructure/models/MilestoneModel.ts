import mongoose, { Schema } from "mongoose";
import { IMilestone } from "../../entities/milestone";

const MilestoneSchema = new Schema<IMilestone>(
    {   
        taskId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"TaskSubmission",
            default: null

        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"freelancerProfile",
            default: null
        },
        title: {
            type:String,
            required:true
        },
        budget: {
            type:Number,
            required:true
        },
        milestones: [
            {
                title:String,
                description: String,
                dueDate: Date,
                cost: Number,
            }
        ]
    },{timestamps:true}
);

export const MilestoneModel = mongoose.model<IMilestone>(
    'milestone',MilestoneSchema
);

