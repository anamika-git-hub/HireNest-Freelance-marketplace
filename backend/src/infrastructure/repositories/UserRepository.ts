import { UserModel } from "../models/UserModel";
import { UserDetailModel } from "../models/UserDetailModel";

export const UserRepository = {

    findUserByEmail: async (email: string) => UserModel.findOne({ email }),
    findUserById: async (id: string) => UserModel.findById(id),
    findUserByRole: async (role: 'client' | 'freelancer' | 'admin')  =>  UserModel.find({role}),
    
    createUser: async (userData: any) => new UserModel(userData).save(),
    updateUser: async (id: string, updates: any) => UserModel.findByIdAndUpdate(id, updates, {new: true}),
    updateUserVerification: async (email: string, isVerified: boolean) => {
        return UserModel.findOneAndUpdate(
            {email},
            {isVerified},
            {new: true}
        );
    },
    toggleBlockUser: async (userId: string, isBlocked: boolean) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isBlocked: !isBlocked},
            {new: true}
        );
        return updatedUser;
    },
    updateRole: async (role: string, userId:string) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true } 
          );
          return updatedUser
    },
    updatePassword: async (userId:string,password:string) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password },
            { new: true } 
          );
          return updatedUser
    }

};
