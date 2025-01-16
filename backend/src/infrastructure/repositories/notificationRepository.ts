import { NotificationModel } from "../models/Notification";
import { INotification } from "../../entities/notification";

export const NotificationRepository = {
    createNotification: async (data:INotification) => new NotificationModel(data).save(),

    getNotification: async (userId:string,type:string) => {
        const ans = await NotificationModel.find({userId,types:type})
        return ans
    },

    deleteNotification: async (id: string) => {
        return await NotificationModel.findByIdAndDelete(id)
    }
}