import mongoose, { Schema } from "mongoose";
import { IChat } from "../../entities/Chat";

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', 
        required: true,
      },
    ],
  },
  { timestamps: true } 
);

export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);
