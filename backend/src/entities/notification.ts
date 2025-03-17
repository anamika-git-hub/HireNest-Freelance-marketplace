import mongoose from "mongoose";

export interface INotification {
   userId: mongoose.Types.ObjectId | string; 
   senderId: mongoose.Types.ObjectId | string;
   role: string; 
   senderName?: string;
   projectName?: string;
   freelancerName?: string;
   text: string;
   types: string;  
   isRead: boolean;
   createdAt: Date;
   profileUrl?: string;
   projectUrl?: string;
   bidStatus?: string;
   requestStatus?: string;
}