import mongoose from "mongoose";

export interface INotification {
   userId: mongoose.Types.ObjectId;
   senderId: mongoose.Types.ObjectId;
   role:string;
   senderName?:string;
   projectName?:string;
   bidStatus?:string;
   requestStatus?:string;
   text: string;
   types: string;
   isRead: boolean;
   createdAt: Date;
   bidderProfileUrl?:string;
   projectUrl?:string;
}