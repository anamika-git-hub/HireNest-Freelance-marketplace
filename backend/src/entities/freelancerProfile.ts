import mongoose from "mongoose";

export interface IFreelancerProfile {
    id: mongoose.Types.ObjectId;
    name: string; 
    location: string;
    tagline: string;
    experience: string;
    hourlyRate: number;
    skills: string[];
    description: string; 
    profileImage: string | null;
    attachments: {
        id: string; 
        file: String; 
        title: string;
        description: string;
    }[]; 
}
