import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";


export const FreelancerProfileRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findOneAndUpdate({userId:id}, updates, {upsert:true,new: true}),

    
    getFreelancers: async (sortCriteria:{ [key: string]: 1 | -1 },skip:number,limit:number,searchTerm:string) => {
        try{
            const query: any = {};

            // Add search logic
            if (searchTerm) {
              query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                // { skills: { $regex: searchTerm, $options: 'i' } },
                // { description: { $regex: searchTerm, $options: 'i' } },
              ];
            }
            const freelancers = await FreelancerProfileModel.find(query).sort(sortCriteria).skip(skip).limit(limit);
            return freelancers
        }catch(error: any){
            throw new Error ('Error get freelancers:' + error.message)
        }
    },
    getFreelancerCount : async (searchTerm:string) => {
        const query: any = {};

  // Add search logic
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
    //   { skills: { $regex: searchTerm, $options: 'i' } },
    //   { description: { $regex: searchTerm, $options: 'i' } },
    ];
  }
        return await FreelancerProfileModel.countDocuments(query);
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