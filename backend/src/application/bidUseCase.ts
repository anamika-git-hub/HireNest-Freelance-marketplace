import { BidRepository } from "../infrastructure/repositories/BidRepository";
import { IBidSubmissionForm } from "../entities/bids";

export const BidUseCase = {
    createBid: async (data: IBidSubmissionForm) => {
        try {
            return await BidRepository.createBid(data);
        } catch (error: any) {
            throw new Error(`Failed to create bid: ${error.message}`);
        }
    },

    updateBid: async (
        id: string,
        updates: Partial<IBidSubmissionForm>,
    ) => {
        try {
            return await BidRepository.updateBid(id, updates);
        } catch (error: any) {
            throw new Error(`Failed to update bid: ${error.message}`);
        }
    },

    deleteBid: async (id: string) => {
        return await BidRepository.deleteBid(id);
    },

    getBidsByTask: async (taskId: string) => {
        return await BidRepository.getBidsByTask(taskId);
    },

    getBidById: async (id: string) => {
        return await BidRepository.getBidById(id);
    },
};
