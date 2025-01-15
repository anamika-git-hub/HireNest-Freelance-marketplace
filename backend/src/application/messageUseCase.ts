import { MessageRepository } from "../infrastructure/repositories/messageRepository";

export const MessageUseCase = {
    getReceivers: async (userId:string,role:string)=>{
        try {
            const result = await MessageRepository.getReceiver(userId,role);
            console.log('res',result)
            return result;
        } catch (error) {
            throw new Error('Failed to fetch receivers')
        }
    } 
}