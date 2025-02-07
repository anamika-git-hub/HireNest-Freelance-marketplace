import mongoose,{mongo, Schema} from "mongoose";
import { IRequest } from "../../entities/RequestForm";

const RequestSchema = new Schema<IRequest>(
    {
        freelancerId:{
            type:Schema.Types.ObjectId,
            ref: 'freelancerProfile',
            required:true,
        },
        requesterId: {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,

        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {timestamps: true}
);

export const RequestModel = mongoose.model<IRequest>(
    "RequestSubmission",RequestSchema
);