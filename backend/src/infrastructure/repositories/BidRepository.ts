import { BidSubmissionModel } from "../models/BidSubmissionModel";
import { IBidSubmissionForm } from "../../entities/bids";

export const BidRepository = {
    createBid: async (data: IBidSubmissionForm) => {
        try {
            const bid = new BidSubmissionModel(data);
            return await bid.save();
        } catch (error: any) {
            throw new Error("Error creating bid: " + error.message);
        }
    },

    updateBid: async (id: string, updates: Partial<IBidSubmissionForm>) => {
        try {
            const updatedBid = await BidSubmissionModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedBid) throw new Error("Bid not found");
            return updatedBid;
        } catch (error: any) {
            throw new Error("Error updating bid: " + error.message);
        }
    },

    deleteBid: async (id: string) => {
        try {
            const deletedBid = await BidSubmissionModel.findByIdAndDelete(id);
            if (!deletedBid) throw new Error("Bid not found");
            return deletedBid;
        } catch (error: any) {
            throw new Error("Error deleting bid: " + error.message);
        }
    },

    getBidsByTask: async (taskId: string) => {
        try {
            return await BidSubmissionModel.find({ taskId }).populate("bidderId");
        } catch (error: any) {
            throw new Error("Error fetching bids: " + error.message);
        }
    },

    getBidById: async (id: string) => {
        try {
            const bid = await BidSubmissionModel.find({bidderId:id}).populate("taskId");
            if (!bid) throw new Error("Bid not found");
            return bid;
        } catch (error: any) {
            throw new Error("Error fetching bid: " + error.message);
        }
    },
};
