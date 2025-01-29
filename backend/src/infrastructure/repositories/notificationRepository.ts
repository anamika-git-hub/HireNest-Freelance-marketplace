import { NotificationModel } from "../models/Notification";
import { INotification } from "../../entities/notification";

export const NotificationRepository = {
    createNotification: async (data:INotification) => new NotificationModel(data).save(),

    getNotification: async (userId:string) => {
        return await NotificationModel.find({userId})
    },

    deleteNotification: async (id: string) => {
        return await NotificationModel.findByIdAndDelete(id)
    },
    notificationRead: async (notificationId:string) => {
        return await NotificationModel.findByIdAndUpdate(notificationId,{isRead:true})
    }
}