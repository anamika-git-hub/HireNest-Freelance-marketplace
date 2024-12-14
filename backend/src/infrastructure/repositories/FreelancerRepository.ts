import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";

export const FreelancerRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findByIdAndUpdate(id, updates, {new: true})
    
}