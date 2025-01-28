import mongoose,{Schema} from "mongoose";
import { IMessage } from "../../entities/Message";

const MessageSchema = new Schema<IMessage>({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId,required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId,required: true },
  type: { type:String, enum:['sent','received' ]},
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
}, { timestamps: true});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
