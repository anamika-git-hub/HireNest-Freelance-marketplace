import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { uploadToS3 } from "../utils/uploader";

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
    },
    fileUpload: async (file: Express.Multer.File) => {
        try {
            const uploadFile = async(file: Express.Multer.File, folderName: string) => {
                try {
                    const uniqueFileName = `${Date.now()}-${file.originalname}`;
                    return await uploadToS3(
                        file.buffer,
                        `${folderName}/${uniqueFileName}`
                    );
                } catch (error) {
                    console.error(`Error uploading to S3:`, error);
                    throw new Error(`Failed to upload file to S3`);
                }
            };
            
            if (!file) {
                throw new Error('No file provided');
            }

            let folderName = 'messages';
            
            if (file.mimetype.startsWith('image/')) {
                folderName = 'images';
            } else if (file.mimetype.startsWith('video/')) {
                folderName = 'videos';
            } else if (file.mimetype.startsWith('audio/')) {
                folderName = 'audios';
            } else {
                folderName = 'documents';
            }
            
            const uploadResult = await uploadFile(file, folderName);
            
            return {
                url: uploadResult.Location,
                key: uploadResult.Key,
                fileName: file.originalname,
                fileType: file.mimetype
            };
        } catch (error) {
            console.error('Error in fileUpload usecase:', error);
            throw error;
        }
    },
    getUnreadMessages: async (userId: string, role: string) => {
        try {
          let adjustedUserId: string | null = userId;
          if (role === 'freelancer') {
            const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(userId);
            adjustedUserId = freelancerProfile ? freelancerProfile._id.toString() : null;
          } else if (role === 'client') {
            const clientProfile = await AccountDetailRepository.findUserDetailsById(userId);
            adjustedUserId = clientProfile ? clientProfile._id.toString() : null;
          }
          
          const messages = await MessageRepository.getUnreadMessages(adjustedUserId, role);
          
          const messagesWithSenders = await Promise.all(messages.map(async (message) => {
            let senderDetails = null;
            
            if (role === 'freelancer') {
              senderDetails = await AccountDetailRepository.findUserDetailsById(message.userId.toString());
            } else if (role === 'client') {
              senderDetails = await FreelancerProfileRepository.getFreelancerByUserId(message.userId.toString());
            }
            
            return {
              ...message.toObject(),
              senderDetails: senderDetails || {}
            };
          }));
          
          return messagesWithSenders;
        } catch (error) {
          throw new Error('Failed to fetch unread messages');
        }
      }
}