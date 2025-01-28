import { ChatModel } from "../models/ChatModel";
import { UserDetailModel } from "../models/UserDetailModel";
import { IChat } from "../../entities/Chat";
import { FreelancerProfileModel } from "../models/freelancerProfile";
import mongoose from "mongoose";

export const MessageRepository = {
    getReceiver: async (userId: string | null, role: string) => {
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
                { _id: { $in: idsArray } },
                "firstname lastname profileImage userId"
            );
            return receiverDetails;
        } else if (role === 'client') {
            const chatterDetails = await FreelancerProfileModel.find(
                { _id: { $in: idsArray } },
                "name profileImage userId"
            );
            return chatterDetails;
        }
        return []; 
    }  ,

    setContacts: async (senderId: string | null, receiverId: string | null)=> {
        let chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] },
          });
      
          if (!chat) {
            chat = new ChatModel({
              participants: [senderId, receiverId],
              messages: [], 
            });
            await chat.save();
          }
    }
}
