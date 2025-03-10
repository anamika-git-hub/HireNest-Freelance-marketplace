import { INotification } from "../../entities/notification";
import mongoose,{Schema} from "mongoose";

export const NotificationSchema = new Schema<INotification>(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId || String,
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
            enum:[
                'bid_placed',
                'bid_accepted',
                'bid_rejected',
                'request_submission',
                'request_accepted',
                'request_rejected',
                'contract_submission',
                'contract_accepted',
                'contract_rejected',
                'milestone_activated',
                'milestone_submission',
                'milestone_rejected',
                'milestone_accepted',
                'review',
            ],
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