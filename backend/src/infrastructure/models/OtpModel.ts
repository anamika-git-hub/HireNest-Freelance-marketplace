import mongoose, {Schema} from "mongoose";
import { IOTP } from "../../entities/otp";

const OtpSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            default:()=> new Date(Date.now() + 1*60*1000),
            index: {expires:'1m'},
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

    },
    {timestamps:true}
);

export const OtpModel = mongoose.model<IOTP>('Otp',OtpSchema);