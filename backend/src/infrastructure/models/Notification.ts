import { INotification } from "../../entities/notification";
import mongoose,{Schema} from "mongoose";

export const NotificationSchema = new Schema<INotification>(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        text: {
            type: String,
            required:true
        },
        isRead: {
            type: Boolean,
            default: false,
            required:true
        },
        types: {
            type:String,
            enum:['bid','request'],
            required:true
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    },
    { timestamps: true}
)

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);