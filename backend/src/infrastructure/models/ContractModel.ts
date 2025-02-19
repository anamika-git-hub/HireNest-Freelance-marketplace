import mongoose, { Schema } from "mongoose";
import { IContract } from "../../entities/contract";

const ContractSchema = new Schema<IContract>(
    {   
        bidId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"BidSubmission",
        default: null
        },
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
        description: {
            type:String,
        }, 
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        startDate: {
            type: Date,
            default: null
        },
        milestones: [
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                dueDate: {
                    type: Date,
                    required: true
                },
                cost: {
                    type: Number,
                    required: true
                },
                status: {
                    type: String,
                    enum: ["active", "unpaid", "completed"], 
                    default: "unpaid"
                }
            }
        ]
    },{timestamps:true}
);

export const ContractModel = mongoose.model<IContract>(
    'contract',ContractSchema
);

