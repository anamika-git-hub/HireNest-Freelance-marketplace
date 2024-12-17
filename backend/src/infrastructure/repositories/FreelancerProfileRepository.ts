import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";


export const FreelancerProfileRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findByIdAndUpdate(id, updates, {new: true}),

    
    getFreelancers: async () => {
        try{
            const freelancers = await FreelancerProfileModel.find();
            return freelancers
        }catch(error: any){
            throw new Error ('Error get freelancers:' + error.message)
        }
    }
    
}