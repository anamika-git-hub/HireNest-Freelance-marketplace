import mongoose , {Schema} from "mongoose";
import { IFreelancerProfile } from "../../entities/freelancerProfile";

const FreelancerProfileSchema = new Schema<IFreelancerProfile>({
    userId: {type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    tagline:{
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    description:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        required: true
    },
    attachments:[{
        id: {
            type: String,
        },
        file:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        }
    }]
}, { timestamps: true })

export const FreelancerProfileModel = mongoose.model<IFreelancerProfile>('freelancerProfile',FreelancerProfileSchema)