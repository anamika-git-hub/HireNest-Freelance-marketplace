// import FreelancerProfileModel from "../models/FreelancerProfileModel";
// import ClientProfileModel from "../models/ClientProfileModel";

// export const ProfileRepository = {

//     findProfileByUserId: async (userId: string, role: 'freelancer' | 'client') => {
//         if(role === 'freelancer') {
//             return FreelancerProfileModel.findOne({userId});
//         }
//         return ClientProfileModel.findOne({userId});
//     }

// };

import { UserDetailModel } from "../models/UserDetailModel";
import { IUserDetail } from "../../entities/UserDetail";

export const ProfileRepository = {
    createProfile: async (data:IUserDetail) => new UserDetailModel(data).save(),

    updateProfile: async (id: string, updates: IUserDetail) => UserDetailModel.findByIdAndUpdate(id,updates,{new:true}),

    

    
}