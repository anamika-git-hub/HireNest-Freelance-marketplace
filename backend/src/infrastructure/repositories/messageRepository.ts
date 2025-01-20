import { ChatModel } from "../models/ChatModel";
import { UserDetailModel } from "../models/UserDetailModel";
import { IChat } from "../../entities/Chat";
import { FreelancerProfileModel } from "../models/freelancerProfile";
import mongoose from "mongoose";

export const MessageRepository = {
    getReceiver: async (userId: string, role: string) => {
        const contacts = await ChatModel.find({
           participants:userId
        });
        const contactIds = new Set<string>();
        contacts.forEach((chat: IChat) => {
            chat.participants.forEach((participant: mongoose.Types.ObjectId) => {
                if (participant.toString() !== userId) {
                    contactIds.add(participant.toString());  
                }
            });
        });
    
        const idsArray = Array.from(contactIds);
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
            return chatterDetails;
        }
        return []; 
    }  ,

    setContacts: async (userId: string, receiverId: string)=> {
        let chat = await ChatModel.findOne({
            participants: { $all: [userId, receiverId] },
          });
      
          if (!chat) {
            chat = new ChatModel({
              participants: [userId, receiverId],
              messages: [], 
            });
            await chat.save();
          }
    }
}
