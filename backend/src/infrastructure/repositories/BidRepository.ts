import { BidSubmissionModel } from "../models/BidSubmissionModel";
import { IBidSubmissionForm } from "../../entities/Bids";
import mongoose from "mongoose";

export const BidRepository = {
    createBid: async (data: IBidSubmissionForm) => {
        try {
            const bid = new BidSubmissionModel(data);
            return await bid.save();
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create bid: ${error.message}`);
            }else {
                throw new Error(`Failed to create bid due to an unknown error`);
            } 
        }
    },

    updateBid: async (id: string, updates: Partial<IBidSubmissionForm>) => {
        try {
            const updatedBid = await BidSubmissionModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedBid) throw new Error("Bid not found");
            return updatedBid;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update bid: ${error.message}`);
            }else {
                throw new Error(`Failed to update bid due to an unknown error`);
            } 
        }
    },

    deleteBid: async (id: string) => {
        try {
            const deletedBid = await BidSubmissionModel.findByIdAndDelete(id);
            if (!deletedBid) throw new Error("Bid not found");
            return deletedBid;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to delete bid: ${error.message}`);
            }else {
                throw new Error(`Failed to delete bid due to an unknown error`);
            } 
        }
    },

    getBidsByTask: async (taskId: string) => {
        try {
            const bids =  await BidSubmissionModel.find({ taskId })
            return bids
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get bids : ${error.message}`);
            }else {
                throw new Error(`Failed to get bids due to an unknown error`);
            } 
        }
    },

    getBidByBidderId: async (id: string) => {
        try {
            const bid = await BidSubmissionModel.find({bidderId:id}).populate("taskId");
            if (!bid) throw new Error("Bid not found");
            return bid;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get bids by Id: ${error.message}`);
            }else {
                throw new Error(`Failed to get bids by Id due to an unknown error`);
            } 
        }
    },

    getBidById: async (id:string) => {
        try {
            const bid = await BidSubmissionModel.findById(id).populate("taskId")
            if (!bid) throw new Error("Bid not found");
            return bid;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get bids by Id: ${error.message}`);
            }else {
                throw new Error(`Failed to get bids by Id due to an unknown error`);
            }  
        }
    },

    updateBidStatus: async (id: string, status:string) => {
        try {
            const updatedBid = await BidSubmissionModel.findByIdAndUpdate(id, {status}, { new: true });
            if (!updatedBid) throw new Error("Bid not found");
            return updatedBid;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update bid: ${error.message}`);
            }else {
                throw new Error(`Failed to update bid due to an unknown error`);
            } 
        }
    },
    getFreelancerBidStats: async(freelancerId: string, startDate:Date, endDate:Date) => {
        const ObjectId = mongoose.Types.ObjectId;
    
        const monthlyBids = await BidSubmissionModel.aggregate([
          {
            $match: {
              bidderId: new ObjectId(freelancerId),
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
              },
              bidsPlaced: { $sum: 1 },
              bidsWon: { 
                $sum: { 
                  $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] 
                }
              }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        const quarterlyBids = await BidSubmissionModel.aggregate([
          {
            $match: {
              bidderId: new ObjectId(freelancerId),
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                quarter: { 
                  $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
                }
              },
              bidsPlaced: { $sum: 1 },
              bidsWon: { 
                $sum: { 
                  $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] 
                }
              }
            }
          },
          { $sort: { "_id.year": 1, "_id.quarter": 1 } }
        ]);
        
        const yearlyBids = await BidSubmissionModel.aggregate([
          {
            $match: {
              bidderId: new ObjectId(freelancerId),
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" }
              },
              bidsPlaced: { $sum: 1 },
              bidsWon: { 
                $sum: { 
                  $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] 
                }
              }
            }
          },
          { $sort: { "_id.year": 1 } }
        ]);
        
        return { monthlyBids, quarterlyBids, yearlyBids };
      }
    
};
