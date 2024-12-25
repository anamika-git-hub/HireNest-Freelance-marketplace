import mongoose, { Schema } from "mongoose";
import { IBidSubmissionForm } from "../../entities/bids";

const BidSubmissionSchema = new Schema<IBidSubmissionForm>(
    {
        taskId: {
            type: Schema.Types.ObjectId,
            ref:'TaskSubmission',
            required: true,
        },
        bidderId: {
            type: Schema.Types.ObjectId,
            ref:'freelancerProfile',
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        deliveryTime: {
            type: Number,
            required: true,
        },
        timeUnit: {
            type: String,
            enum:['Days','Weeks'],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const BidSubmissionModel = mongoose.model<IBidSubmissionForm>(
    "BidSubmission",
    BidSubmissionSchema
);
