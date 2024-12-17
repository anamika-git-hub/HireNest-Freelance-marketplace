import { UserDetailModel } from "../models/UserDetailModel";
import { IUserDetail } from "../../entities/UserDetail";

export const AccountDetailRepository = {
    createProfile: async (data:IUserDetail) => new UserDetailModel(data).save(),

    updateProfile: async (id: string, updates: IUserDetail) => UserDetailModel.findByIdAndUpdate(id,updates,{new:true}),
}