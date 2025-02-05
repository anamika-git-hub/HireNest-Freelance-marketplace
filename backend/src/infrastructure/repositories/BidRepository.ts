import { BidSubmissionModel } from "../models/BidSubmissionModel";
import { IBidSubmissionForm } from "../../entities/Bids";

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

    getBidById: async (id: string) => {
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
};
