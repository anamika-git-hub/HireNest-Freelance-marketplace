import { RequestRepository } from "../infrastructure/repositories/RequestRepository";
import { IRequest } from "../entities/RequestForm";
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";

export const RequestUseCase = {
    createRequest: async (data: IRequest) => {
        try {
            const {freelancerId,requesterId} = data
            console.log('ff',freelancerId,requesterId)
            const user = await FreelancerProfileRepository.getFreelancerById(freelancerId.toString());
            const sender = await AccountDetailRepository.findUserDetailsById(requesterId.toString());
            const notification = {
                senderId:requesterId,
                userId: user.userId, 
                text: `You have received a new request from ${sender?.firstname} ${sender?.lastname}.`,
                isRead: false,
                createdAt: new Date(),
                types:'request'
            }
            await NotificationRepository.createNotification(notification);
            return await RequestRepository.createRequest(data);
        } catch (error: any) {
            throw new Error(`Failed to create request: ${error.message}`);
        }
    },

    updateRequest: async (
        id: string,
        updates: Partial<IRequest>,
    ) => {
        try {
            return await RequestRepository.updateRequest(id, updates);
        } catch (error: any) {
            throw new Error(`Failed to update request: ${error.message}`);
        }
    },

    deleteRequest: async (id: string) => {
        return await RequestRepository.deleteRequest(id);
    },

    getRequestById: async (id: string) => {
        return await RequestRepository.getRequestById(id);
    },
    getRequestByUserId: async (id:string) => {
        return await RequestRepository.getRequestByUserId(id);
    }
};
