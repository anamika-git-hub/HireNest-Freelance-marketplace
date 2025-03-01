// infrastructure/repositories/FreelancerReviewRepository.ts

import { FreelancerReviewModel } from "../models/freelancerReviewSchema";
import { IFreelancerReview } from "../../entities/freelancerReview";
import mongoose from "mongoose";

export const FreelancerReviewRepository = {
    createReview: async (reviewData: IFreelancerReview) => {
        const review = new FreelancerReviewModel(reviewData);
        return await review.save();
    },
    
    updateReview: async (reviewId: mongoose.Types.ObjectId | string, rating: number, review: string) => {
        return await FreelancerReviewModel.findByIdAndUpdate(
            reviewId,
            { $set: { rating, review } },
            { new: true }
        );
    },
    
    findByContractId: async (contractId: string) => {
        return await FreelancerReviewModel.findOne({ contractId });
    },
    
    findByFreelancerId: async (freelancerId: string) => {
        return await FreelancerReviewModel.find({ freelancerId });
    },
    
    findByFreelancerIdWithClient: async (freelancerId: string) => {
        return await FreelancerReviewModel.find({ freelancerId })
            .populate('clientId', 'name profilePicture')
            .sort({ createdAt: -1 });
    }
};