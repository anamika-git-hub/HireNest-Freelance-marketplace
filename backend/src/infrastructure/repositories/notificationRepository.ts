import { NotificationModel } from "../models/Notification";
import { INotification } from "../../entities/notification";
import { FilterCriteria } from "../../entities/filter";

export const NotificationRepository = {
    createNotification: async (data:INotification) => new NotificationModel(data).save(),

    getNotification: async (userId: string, filters?: FilterCriteria, skip?: number, limit?: number) => {
        const baseQuery = { userId, ...filters };
        
        if (typeof skip === 'undefined' || typeof limit === 'undefined') {
            return await NotificationModel.find(baseQuery).sort({ createdAt: -1 });
        }
        
        return await NotificationModel.find(baseQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },
    
    getNotificationCount: async (userId: string, filters?: FilterCriteria) => {
        const baseQuery = { userId, ...filters };
        return await NotificationModel.countDocuments(baseQuery);
    },
    deleteNotification: async (id: string) => {
        return await NotificationModel.findByIdAndDelete(id)
    },
    notificationRead: async (notificationId:string) => {
        return await NotificationModel.findByIdAndUpdate(notificationId,{isRead:true})
    },
    notificationReadAll: async (userId: string, role: string) => {
        return await NotificationModel.updateMany(
            { 
                userId: userId, 
                role: role,
                isRead: false 
            },
            { 
                isRead: true 
            }
        );
    }
}