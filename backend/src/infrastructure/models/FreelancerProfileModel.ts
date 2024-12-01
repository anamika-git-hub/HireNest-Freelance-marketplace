import mongoose,{Schema} from "mongoose";
import { IFreelancerProfile } from "../../entities/freelancerProfile";

const FreelancerSchema = new Schema<IFreelancerProfile>(
    {
       freelancerId:{
        type:String,
        required: false,
        unique: true
       },
       fullName:{
        type: String,
        required: true
       },
       phone: {
        type: String,
        required: true
       },
       location: {
        type: String,
        required: true
       },
       rolePosition: {
        type: String,
        required: true,
       },
       categoryId: {
        type: String,
        required: true
       },
       hourlyRate: {
        type: Number,
        required: true
       },
       experienceYears:{
        type: Number,
        required: true
       },
       description: {
        type: String,
        required: true
       },
       skills: {
        type: [String],
        required: true
       },
       portfolioId:{
        type: String,
        required: false
       }
    },
    {timestamps: true}
) 
const FreelancerProfileModel = mongoose.model<IFreelancerProfile>('FreelancerProfile',FreelancerSchema);
export default FreelancerProfileModel;