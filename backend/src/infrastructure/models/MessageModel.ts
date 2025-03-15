import mongoose,{Schema} from "mongoose";
import { IMessage } from "../../entities/Message";

const MessageSchema = new Schema<IMessage>({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId,required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId,required: true },
  type: { type:String, enum:['sent','received' ]},
  text: { type: String},
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  mediaUrl: {type: String},
  mediaType: { type: String, enum: ['image', 'video', 'audio', 'file']},
  fileName: {type: String}
}, { timestamps: true});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
