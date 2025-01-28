import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";

export const MessageUseCase = {
    getReceivers: async (userId:string,role:string)=>{
        try {

            let adjustedUserId:string | null = userId
            if(role === 'freelancer'){
                const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(userId)
                adjustedUserId = freelancerProfile?freelancerProfile._id.toString() : null;
            }else if (role === 'client'){
                const clientProfile = await AccountDetailRepository.findUserDetailsById(userId)
                adjustedUserId = clientProfile?clientProfile._id.toString() : null;
            }
            const result = await MessageRepository.getReceiver(adjustedUserId,role);
            
            return result;
        } catch (error) {
            throw new Error('Failed to fetch receivers')
        }
    } ,

    setContacts: async(senderId: string,receiverId:string, role: string) => {
        try {
            let adjustedSenderId:string | null = senderId
            let adjustedReceiverId:string | null = receiverId
            if(role === 'freelancer'){
                const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(senderId)
                adjustedSenderId = freelancerProfile?freelancerProfile._id.toString() : null;
                const clientProfile = await AccountDetailRepository.findUserDetailsById(receiverId)
                adjustedReceiverId = clientProfile?clientProfile._id.toString() : null;
            }else if (role === 'client'){
                const clientProfile = await AccountDetailRepository.findUserDetailsById(senderId)
                adjustedSenderId = clientProfile?clientProfile._id.toString() : null;
                const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(receiverId)
                adjustedReceiverId = freelancerProfile?freelancerProfile._id.toString() : null;
            }
            const result = await MessageRepository.setContacts(adjustedSenderId,adjustedReceiverId);
            
            return result;
        } catch (error) {
            throw new Error('Failed to post contacts')
        }
    }
}