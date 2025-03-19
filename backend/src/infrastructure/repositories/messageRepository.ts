import { ChatModel } from "../models/ChatModel";
import { UserDetailModel } from "../models/UserDetailModel";
import { MessageModel } from "../models/MessageModel";
import { IChat } from "../../entities/Chat";
import { FreelancerProfileModel } from "../models/freelancerProfile";
import mongoose from "mongoose";

export const MessageRepository = {
    getReceiver: async (userId: string | null, role: string) => {
        const contacts = await ChatModel.find({
           participants:userId
        });
        const contactIds = new Set<string>();
        let contactData: any[] = [];
        for (const chat of contacts) {
            for (const participant of chat.participants) {
                const participantId = participant.toString();
                if (participantId !== userId) {
                    contactIds.add(participantId);

                    const lastMessage = await MessageModel.findOne({
                        $or: [
                            { senderId: userId, receiverId: participantId },
                            { senderId: participantId, receiverId: userId }
                        ]
                    }).sort({ createdAt: -1 });

                    const unreadCount = await MessageModel.countDocuments({
                        senderId: participantId,
                        receiverId: userId,
                        isRead: false
                    });

                    contactData.push({
                        _id: participantId,
                        lastMessage: lastMessage, 
                        unreadCount: unreadCount
                    });
                }
            }
        }
    
        const idsArray = Array.from(contactIds);
        let userDetails: any[] = [];
        if (role === 'freelancer') {
            userDetails = await UserDetailModel.find(
                { _id: { $in: idsArray } },
                "firstname lastname profileImage userId"
            );
        } else if (role === 'client') {
            userDetails= await FreelancerProfileModel.find(
                { _id: { $in: idsArray } },
                "name profileImage userId"
            );
        }

        const finalContacts = contactData.map(contact => {
            const userDetail = userDetails.find(user => user._id.toString() === contact._id);
            if (userDetail) {
                return {
                    ...contact,
                    name: role === 'freelancer' ? `${userDetail.firstname} ${userDetail.lastname}` : userDetail.name,
                    profileImage: userDetail.profileImage,
                    userId: userDetail.userId
                };
               
            }
           
            return contact;

        });

        return finalContacts; 
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
    },
    getUnreadMessages: async (userId: string | null, role: string) => {
        const messages = await MessageModel.find({
          receiverId: userId,
          isRead: false
        }).sort({ createdAt: -1 }); 
        
        return messages;
      }
}
