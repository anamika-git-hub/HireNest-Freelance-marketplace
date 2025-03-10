import mongoose from "mongoose";
import { BidRepository } from "../infrastructure/repositories/BidRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { IBidSubmissionForm } from "../entities/Bids";
import { sendNotification } from "..";
import { ITaskSubmissionForm } from "../entities/Tasks";


const getNotificationText = (status: 'accepted' | 'rejected', projectName: string): string => {
    const messages = {
        accepted: `Congratulations! Your bid for the project ${projectName} has been accepted by the client.`,
        rejected: `We regret to inform you that the client has rejected your bid for ${projectName}.`
    } as const;
    
    return messages[status];
};

export const BidUseCase = {
    createBid: async (data: IBidSubmissionForm) => {
        try {
            const {taskId,bidderId} = data
             const user = await TaskRepository.getTaskById(taskId.toString());
             const sender = await FreelancerProfileRepository.getFreelancerByUserId(bidderId.toString());
                    const notificationData = {
                            senderId:bidderId,
                            userId: user.clientId, 
                            role:'client',
                            senderName: sender.name,
                            projectName: user.projectName,
                            text: `${sender.name} placed a bid on your ${user.projectName} project`,
                            isRead: false,
                            createdAt: new Date(),
                            types:'bid_placed',
                            profileUrl:`/client/freelancer-detail/${sender._id}`,
                            projectUrl:`/client/bidders-list/${taskId}`
                        }
             await NotificationRepository.createNotification(notificationData);

             sendNotification(user.clientId.toString(), {
                ...notificationData
            });
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
        return await BidRepository.getBidByBidderId(id);
    },
    updateBidStatus: async (id: string, status:string) => {
        const bid = await BidRepository.getBidById(id);
        if (!bid?.taskId) return await BidRepository.updateBidStatus(id, status);
        function isPopulatedTask(
            task: mongoose.Types.ObjectId | ITaskSubmissionForm
        ): task is ITaskSubmissionForm {
            return (task as ITaskSubmissionForm).projectName !== undefined;
        }

         if (!isPopulatedTask(bid.taskId)) {
            throw new Error('Task data not populated');
        }
        const { clientId, _id, projectName } = bid.taskId;
        const { bidderId } = bid;
        const taskId = _id?.toString()
        if (!taskId) {
            throw new Error('Task ID is undefined');
        }

        if (status === 'accepted') {
            await TaskRepository.updateTaskStatus(taskId, 'onhold');
        }
    
        if (status === 'accepted' || status === 'rejected') {
            const notificationData = {
                senderId: clientId,
                userId: bidderId,
                role: 'freelancer',
                projectName,
                text: getNotificationText(status, projectName),
                isRead: false,
                createdAt: new Date(),
                types:status === 'accepted'?'bid_accepted': 'bid_rejected',
                projectUrl: `/freelancer/task-detail/${taskId}`
            };
    
            await NotificationRepository.createNotification(notificationData);
    
            sendNotification(bidderId.toString(), {
                ...notificationData,
                text: getNotificationText(status === 'accepted' ? 'rejected' : 'accepted', projectName),
                projectUrl: `/client/task-detail/${taskId}`
            });
        }
    
        return await BidRepository.updateBidStatus(id, status);
    }
};
