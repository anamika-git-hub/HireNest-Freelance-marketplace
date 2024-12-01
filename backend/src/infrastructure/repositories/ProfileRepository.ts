import FreelancerProfileModel from "../models/FreelancerProfileModel";
import ClientProfileModel from "../models/ClientProfileModel";

export const ProfileRepository = {
    createFreelancerProfile: async (data: any) => new FreelancerProfileModel(data).save(),
    updateFreelancerProfile: async (id: string, updates: any)=>
        FreelancerProfileModel.findByIdAndUpdate(id,updates,{new:true}),

    createClientProfile: async (data: any) => new ClientProfileModel(data).save(),
    updateClientProfile: async (id: string, updates: any) =>
        ClientProfileModel.findByIdAndUpdate(id,updates , {new: true}),

    findProfileByUserId: async (userId: string, role: 'freelancer' | 'client') => {
        if(role === 'freelancer') {
            return FreelancerProfileModel.findOne({userId});
        }
        return ClientProfileModel.findOne({userId});
    }

};