import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";


export const FreelancerProfileRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findOneAndUpdate({userId:id}, updates, {upsert:true,new: true}),

    
    getFreelancers: async () => {
        try{
            const freelancers = await FreelancerProfileModel.find();
            return freelancers
        }catch(error: any){
            throw new Error ('Error get freelancers:' + error.message)
        }
    },
     getFreelancerByUserId: async (id: string) => {
            try {
                const freelancer = await FreelancerProfileModel.findOne({userId:id});
                
    
                if (!freelancer) {
                    throw new Error("freelancer not found");
                }
                return freelancer;
            } catch (error: any) {
                throw new Error("Error fetching freelancer: " + error.message);
            }
        },

        getFreelancerById: async (id: string) => {
            try {
                const freelancer = await FreelancerProfileModel.findById(id);
                if (!freelancer) {
                    throw new Error("freelancer not found");
                }
                return freelancer;
            } catch (error: any) {
                throw new Error("Error fetching freelancer: " + error.message);
            }
        }
    
}