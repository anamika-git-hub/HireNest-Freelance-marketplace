import { MessageModel } from "../models/MessageModel";
import { UserDetailModel } from "../models/UserDetailModel";
import { FreelancerProfileModel } from "../models/freelancerProfile";
import { IMessage } from "../../entities/Message";


export const MessageRepository = {
    getReceiver: async (userId: string, role: string) => {
        const messages = await MessageModel.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        });

        const contactIds = new Set<string>();
        messages.forEach((message: any) => {
            if (message.senderId.toString() === userId) {
                contactIds.add(message.receiverId.toString());
            } else if (message.receiverId.toString() === userId) {
                contactIds.add(message.senderId.toString());
            }
        });
    
        const idsArray = Array.from(contactIds);
    
        if (role === 'freelancer') {
            const receiverDetails = await UserDetailModel.find(
                { userId: { $in: idsArray } },
                "firstname lastname profileImage"
            );
            return receiverDetails;
        } else if (role === 'client') {
            const chatterDetails = await FreelancerProfileModel.find(
                { userId: { $in: idsArray } },
                "name profileImage"
            );
            return chatterDetails;
        }
    
        return []; 
    }  
}
