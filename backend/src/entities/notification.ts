import mongoose from "mongoose";

export interface INotification {
   userId: mongoose.Types.ObjectId;
   senderId: mongoose.Types.ObjectId;
   senderName?:string;
   projectName?:string;
   text: string;
   types: string;
   isRead: boolean;
   createdAt: Date;
   bidderProfileUrl?:string;
   projectUrl?:string;
}