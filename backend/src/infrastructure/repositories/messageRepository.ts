import { ChatModel } from "../models/ChatModel";
import { UserDetailModel } from "../models/UserDetailModel";
import { FreelancerProfileModel } from "../models/freelancerProfile";
import mongoose from "mongoose";

export const MessageRepository = {
    getReceiver: async (userId: string, role: string) => {
        const contacts = await ChatModel.find({
           participants:userId
        });
      console.log('contact',role)
        const contactIds = new Set<string>();
        contacts.forEach((chat: any) => {
            chat.participants.forEach((participant: mongoose.Types.ObjectId) => {
                if (participant.toString() !== userId) {
                    contactIds.add(participant.toString());  
                }
            });
        });
    
        const idsArray = Array.from(contactIds);
        console.log('idsArray',idsArray)
        if (role === 'freelancer') {
            const receiverDetails = await UserDetailModel.find(
                { userId: { $in: idsArray } },
                "firstname lastname profileImage userId"
            );
            return receiverDetails;
        } else if (role === 'client') {
            const chatterDetails = await FreelancerProfileModel.find(
                { userId: { $in: idsArray } },
                "name profileImage userId"
            );
            console.log('chatterDetails',chatterDetails)
            return chatterDetails;
        }
        return []; 
    }  
}
