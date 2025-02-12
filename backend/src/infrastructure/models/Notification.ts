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
        role:{
            type:String,
            required:true
        },
        bidStatus:{
            type:String
        },
        requestStatus: {
            type: String,
        },
        senderName: {
            type:String,
        },
        projectName: {
            type:String
        },
        freelancerName: {
            type:String
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
            enum:['bid','request','accepted','rejected'],
            required:true
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        profileUrl: {
            type: String,
        },
        projectUrl: {
            type : String
        }
    },
    { timestamps: true}
)

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);