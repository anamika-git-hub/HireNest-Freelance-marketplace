import { UserDetailModel } from "../models/UserDetailModel";
import { IUserDetail } from "../../entities/UserDetail";

export const AccountDetailRepository = {
    createProfile: async (data: IUserDetail) => new UserDetailModel(data).save(),

    updateProfile: async (userId: string, updates: IUserDetail) => 
        UserDetailModel.findOneAndUpdate({ userId }, updates, { new: true }),  

    
    findUserDetailsById: async( userId:string) => UserDetailModel.findOne({userId}),
    activeClientsCount: async() => UserDetailModel.countDocuments(),
}
