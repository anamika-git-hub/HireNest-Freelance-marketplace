import mongoose from "mongoose";

declare namespace Express {
    interface Request {
      attachmentsMetadata?: string;
    }
  }
  
  export interface IFreelancerProfile {
      _id?: string;
      userId: mongoose.Types.ObjectId | string;
      name: string; 
      location: string;
      tagline: string;
      experience: string;
      hourlyRate: number | string; 
      skills: string[] | string;
      description: string; 
      profileImage: string | null;
      attachments: {
          id: string; 
          file: string; 
          title: string;
          description: string;
      }[];
      attachmentsMetadata?: string; 
  }