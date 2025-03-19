import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { MessageUseCase } from '../../application/messageUseCase';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { MessageMessages } from '../constants/responseMessages';

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

export const MessageController = {
    getReceiver: async (req: Req, res: Res, next: Next) => {
        try {
            const userId = req.query.userId as string;
            const role = req.query.role as string;
            const result = await MessageUseCase.getReceivers(userId, role);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: MessageMessages.RECEIVERS_FETCH_SUCCESS,
                 result
            });
        } catch (error) {
            next(error);
        }
    },

    setContacts: async (req: Req, res: Res, next: Next) => {
        try {
            const {senderId, receiverId, role} = req.body;
            const result = await MessageUseCase.setContacts(senderId, receiverId, role);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: MessageMessages.CONTACTS_SET_SUCCESS,
                result
            });
        } catch (error) {
            next(error);
        }
    },

    fileUpload: async (req: Req, res: Res, next: Next) => {
        try {
            const file = req.file;
            if (!file) {
                throw new Error('No file provided');
            }
            console.log('Received file:', file.originalname, file.mimetype, file.size);

            const result = await MessageUseCase.fileUpload(file);
            console.log('Upload result:', result);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: MessageMessages.FILE_UPLOAD_SUCCESS,
                success: true,
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
            
            sendResponse(res, HttpStatusCode.OK, {
                message: MessageMessages.UNREAD_MESSAGES_FETCH_SUCCESS,
                result
            });
        } catch (error) {
            next(error);
        }
    }
};