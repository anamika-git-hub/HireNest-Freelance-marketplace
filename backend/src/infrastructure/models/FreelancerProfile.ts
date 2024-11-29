import mongoose,{Schema} from "mongoose";

const FreelancerSchema = new Schema(
    {
        fullname:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        },
        
    }
) 