import mongoose from "mongoose";
import { BidRepository } from "../infrastructure/repositories/BidRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { IBidSubmissionForm } from "../entities/Bids";

export const BidUseCase = {
    createBid: async (data: IBidSubmissionForm) => {
        try {
            const {taskId,bidderId} = data
             const user = await TaskRepository.getTaskById(taskId.toString());
                    const sender = await FreelancerProfileRepository.getFreelancerByUserId(bidderId.toString());
                    const notification = {
                            senderId:bidderId,
                            userId: user.clientId, 
                            text: `${sender.name} placed a bid on your ${user.projectName} project`,
                            isRead: false,
                            createdAt: new Date(),
                            types:'bid'
                        }
             await NotificationRepository.createNotification(notification);
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
