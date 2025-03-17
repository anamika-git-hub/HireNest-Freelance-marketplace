import { RequestRepository } from "../infrastructure/repositories/RequestRepository";
import { IRequest } from "../entities/RequestForm";
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { sendNotification } from "..";

const getNotificationText = (status: 'accepted' | 'rejected',freelancerName: string): string => {
    const messages = {
        accepted: `Congratulations! Your request for the freelancer ${freelancerName} has been accepted by the freelancer.`,
        rejected: `We regret to inform you that the freelancer has rejected your request for ${freelancerName}.`
    } as const;
    return messages[status];
}

export const RequestUseCase = {
    createRequest: async (data: IRequest) => {
        try {
            const {freelancerId,requesterId} = data
            const user = await FreelancerProfileRepository.getFreelancerById(freelancerId.toString());
            const sender = await AccountDetailRepository.findUserDetailsById(requesterId.toString());
            const notification = {
                senderId:requesterId,
                userId: user.userId, 
                role:'freelancer',
                senderName: `${sender?.firstname} ${sender?.lastname}`,
                text: `You have received a new request from ${sender?.firstname} ${sender?.lastname}.`,
                isRead: false,
                createdAt: new Date(),
                types:'request_submission'
            }
            await NotificationRepository.createNotification(notification);
            return await RequestRepository.createRequest(data);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create request : ${error.message}`);
            }else {
                throw new Error(`Failed to create request due to an unknown error`);
            } 
        }
    },

    updateRequest: async (
        id: string,
        updates: Partial<IRequest>,
    ) => {
        try {
            return await RequestRepository.updateRequest(id, updates);
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update request : ${error.message}`);
            }else {
                throw new Error(`Failed to update request due to an unknown error`);
            } 
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
    },
    getRequestByFreelancerId: async (id:string) => {
        let freelancerDetail = await FreelancerProfileRepository.getFreelancerByUserId(id)
        let freelancerId = freelancerDetail._id.toString() 
        return await RequestRepository.getRequestByFreelancerId(freelancerId);
    },
    updateRequestStatus: async (id:string, status:string) => {
        const request = await RequestRepository.getRequestById(id);
        if(!request?.freelancerId) return await RequestRepository.updateRequestStatus(id,status)
        const {userId, _id:freelncerProfileId ,name} = request?.freelancerId;
        if (status === 'accepted' || status === 'rejected') {
            const notificationData = {
                senderId: userId,
                userId: request?.requesterId,
                role: 'client',
                freelancerName:name,
                text: getNotificationText(status,name),
                isRead: false,
                createdAt: new Date(),
                types: status === 'accepted'? 'request_accepted':'request_rejected',
                profileUrl:`/client/freelancer-detail/${freelncerProfileId}`

            };

            await NotificationRepository.createNotification(notificationData);

            sendNotification(request?.requesterId.toString(), {
                ...notificationData,
                text:getNotificationText(status === 'accepted' ? 'rejected' : 'accepted', name),
                profileUrl:`/client/freelancer-detail/${freelncerProfileId}`
            })
        }

        return await RequestRepository.updateRequestStatus(id,status)

    }
};
