import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IFreelancerProfile } from "../../entities/freelancerProfile";
import { FilterCriteria } from "../../entities/filter";
import mongoose, { PipelineStage } from "mongoose";
import { FreelancerReviewModel } from "../models/freelancerReviewSchema";


export const FreelancerProfileRepository = {
    createProfile : async (data: IFreelancerProfile) => new FreelancerProfileModel(data).save(),

    updateProfile: async (id: string, updates: Partial<IFreelancerProfile>) => 
        FreelancerProfileModel.findOneAndUpdate({userId:id}, updates, {upsert:true,new: true}),

    getFreelancers: async (filters: FilterCriteria, sortCriteria: { [key: string]: 1 | -1 }, skip: number, limit: number) => {
        try {
            let freelancers;
            
            if (sortCriteria.hasOwnProperty('rating')) {
                const pipeline: PipelineStage[] = [
                    { $match: filters },
                    {
                        $lookup: {
                            from: "freelancerreviews",
                            localField: "_id",
                            foreignField: "freelancerId",
                            as: "reviews"
                        }
                    },
                    {
                        $addFields: {
                            averageRating: {
                                $cond: {
                                    if: { $eq: [{ $size: "$reviews" }, 0] },
                                    then: 0,
                                    else: { $avg: "$reviews.rating" }
                                }
                            },
                            totalReviews: { $size: "$reviews" }
                        }
                    },
                    { $sort: { averageRating: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            reviews: 0
                        }
                    }
                ];
                
                freelancers = await FreelancerProfileModel.aggregate(pipeline);
            } else {
                freelancers = await FreelancerProfileModel.find(filters).sort(sortCriteria).skip(skip).limit(limit);
                
                if (freelancers.length > 0) {
                    const freelancerIds = freelancers.map(f => f._id);
                    
                    const ratings = await FreelancerReviewModel.aggregate([
                        {
                            $match: {
                                freelancerId: { $in: freelancerIds }
                            }
                        },
                        {
                            $group: {
                                _id: "$freelancerId",
                                averageRating: { $avg: "$rating" },
                                totalReviews: { $count: {} }
                            }
                        }
                    ]);
                    
                    freelancers = freelancers.map(freelancer => {
                        const ratingInfo = ratings.find(r => r._id.toString() === freelancer._id.toString());
                        return {
                            ...freelancer.toObject(),
                            averageRating: ratingInfo ? ratingInfo.averageRating : 0,
                            totalReviews: ratingInfo ? ratingInfo.totalReviews : 0
                        };
                    });
                }
            }
            
            return freelancers;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get freelancers: ${error.message}`);
            } else {
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
                    throw new Error("Freelancer not found");
                }
        
                const reviews = await FreelancerReviewModel.aggregate([
                    {
                        $match: { freelancerId: new mongoose.Types.ObjectId(id) }
                    },
                    {
                        $lookup: {
                            from: "userdetails",
                            localField: "clientId",
                            foreignField: "userId",
                            as: "clientInfo"
                        }
                    },
                    {
                        $addFields: {
                            clientName: {
                                $cond: {
                                    if: { $gt: [{ $size: "$clientInfo" }, 0] },
                                    then: {
                                        $concat: [
                                            { $arrayElemAt: ["$clientInfo.firstname", 0] },
                                            " ",
                                            { $arrayElemAt: ["$clientInfo.lastname", 0] }
                                        ]
                                    },
                                    else: "Anonymous Client"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            clientInfo: 0
                        }
                    }
                ]);
                const avgRating = reviews.length > 0 
                    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
                    : 0;
        
                // Return combined data
                return {
                    ...freelancer.toObject(),
                    reviews: reviews,
                    averageRating: avgRating,
                    totalReviews: reviews.length
                };
            } catch (error) {
                if(error instanceof Error){
                    throw new Error(`Failed to get freelancer by Id: ${error.message}`);
                } else {
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
        },
        activeFreelancersCount: async() => {
            return await FreelancerProfileModel.countDocuments();
        }
    
}