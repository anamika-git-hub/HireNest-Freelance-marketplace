import mongoose from "mongoose";

export interface IMessage {
    userId:mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    type: string;
    text: string;
    createdAt: Date;
    isRead: boolean;
}