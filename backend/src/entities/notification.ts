import mongoose from "mongoose";

export interface INotification {
   userId: mongoose.Types.ObjectId;
   senderId: mongoose.Types.ObjectId;
   text: string;
   types: string;
   isRead: boolean;
   createdAt: Date;
}