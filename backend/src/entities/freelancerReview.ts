

import mongoose from "mongoose";

export interface IFreelancerReview {
    freelancerId: mongoose.Types.ObjectId | string;
    clientId: mongoose.Types.ObjectId | string;
    contractId: mongoose.Types.ObjectId | string;
    rating: number;
    review: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
}