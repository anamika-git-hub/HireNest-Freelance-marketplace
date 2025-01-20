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
                            senderName: sender.name, 
                            projectName: user.projectName,
                            text: `${sender.name} placed a bid on your ${user.projectName} project`,
                            isRead: false,
                            createdAt: new Date(),
                            types:'bid',
                            bidderProfileUrl:`/client/freelancer-detail/${sender._id}`,
                            projectUrl:`/client/bidders-list/${taskId}`
                        }
             await NotificationRepository.createNotification(notification);
            return await BidRepository.createBid(data);

        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create bid: ${error.message}`);
            }else {
                throw new Error(`Failed to create bid due to an unknown error`);
            }
            
        }
    },

    updateBid: async (
        id: string,
        updates: Partial<IBidSubmissionForm>,
    ) => {
        try {
            return await BidRepository.updateBid(id, updates);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update bid: ${error.message}`);
            }else {
                throw new Error(`Failed to update bid due to an unknown error`);
            }
            
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
