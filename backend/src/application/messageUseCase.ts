import { MessageRepository } from "../infrastructure/repositories/messageRepository";

export const MessageUseCase = {
    getReceivers: async (userId:string,role:string)=>{
        try {
            const result = await MessageRepository.getReceiver(userId,role);
            
            return result;
        } catch (error) {
            throw new Error('Failed to fetch receivers')
        }
    } ,

    setContacts: async(userId: string,receiverId:string) => {
        try {
            const result = await MessageRepository.setContacts(userId,receiverId);
            
            return result;
        } catch (error) {
            throw new Error('Failed to post contacts')
        }
    }
}