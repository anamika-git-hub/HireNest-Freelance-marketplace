import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";
import { FilterCriteria } from "../../entities/filter";


export const FreelancerProfileRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findOneAndUpdate({userId:id}, updates, {upsert:true,new: true}),

    
    getFreelancers: async (filters:FilterCriteria,sortCriteria:{ [key: string]: 1 | -1 },skip:number,limit:number) => {
        try{
            const freelancers = await FreelancerProfileModel.find({...filters}).sort(sortCriteria).skip(skip).limit(limit);
            return freelancers
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get freelancers: ${error.message}`);
            }else {
                throw new Error(`Failed to get freelancers due to an unknown error`);
            } 
        }
    },
    getFreelancerCount : async (filters:FilterCriteria) => {
  
        return await FreelancerProfileModel.countDocuments({...filters});
    },
     getFreelancerByUserId: async (id: string) => {
            try {
                const freelancer = await FreelancerProfileModel.findOne({userId:id});
                
    
                if (!freelancer) {
                    throw new Error("freelancer not found");
                }
                return freelancer;
            }catch (error) {
                if(error instanceof Error){
                    throw new Error(`Failed to get freelancer by userId: ${error.message}`);
                }else {
                    throw new Error(`Failed to get freelancer by userId due to an unknown error`);
                } 
            }
        },

        getFreelancerById: async (id: string) => {
            try {
                const freelancer = await FreelancerProfileModel.findById(id);
                if (!freelancer) {
                    throw new Error("freelancer not found");
                }
                return freelancer;
            } catch (error) {
                if(error instanceof Error){
                    throw new Error(`Failed to get freelancer by Id: ${error.message}`);
                }else {
                    throw new Error(`Failed to get freelancer by Id due to an unknown error`);
                } 
            }
        },
        updateFreelancerRating: async (userId: string, averageRating: number, totalReviews: number) => {
            return await FreelancerProfileModel.findOneAndUpdate(
                {userId},
                { 
                    $set: { 
                        averageRating,
                        totalReviews
                    } 
                },
                { new: true }
            );
        }
    
}