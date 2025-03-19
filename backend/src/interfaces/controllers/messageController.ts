import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { MessageUseCase } from '../../application/messageUseCase';

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

export const MessageController = {
    getReceiver: async (req: Req, res: Res, next: Next) => {
        try {
            
            const userId = req.query.userId as string ;
            const role = req.query.role as string ;
            const result = await MessageUseCase.getReceivers(userId,role);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    },

    setContacts : async (req: Req, res: Res, next: Next) => {
        try {
            const {senderId,receiverId,role} = req.body;
            const result = await MessageUseCase.setContacts(senderId,receiverId,role)
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    },

    fileUpload: async (req: Req, res: Res, next: Next) => {
        try {
            const file = req.file;
            if(!file){
                throw new Error('No file provided')
            }console.log('Received file:', file.originalname, file.mimetype, file.size);

            const result = await MessageUseCase.fileUpload(file);
            console.log('Upload result:', result);
            res.status(200).json({
                success: true,
                message: "File upload successful",
                url: result.url,
                fileName: result.fileName,
                fileType: result.fileType
            });
        } catch (error) {
            next(error);
        }
    },
    getUnreadMessages: async (req: CustomRequest, res: Res, next: Next) => {
        try {
          const userId = req.user?.userId || "";
          const role = req.query.role as string;
          
          const result = await MessageUseCase.getUnreadMessages(userId, role);
          
          res.status(200).json({
            result
          });
        } catch (error) {
          next(error);
        }
      }
}