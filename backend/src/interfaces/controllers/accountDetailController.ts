import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { AccountDetailUseCase } from '../../application/accountDetailUseCase';
import { userUseCase } from '../../application/userUseCase';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from '../../utils/responseHandler';
import { AccountMessages } from '../constants/responseMessages';

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

export const AccountDetailController = {
    setUpAccount: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const files = req.files as { [key: string]: Express.Multer.File[] };
        
            const result = await AccountDetailUseCase.setUpProfile(data, files);
            sendResponse(res, HttpStatusCode.CREATED, { 
                message: AccountMessages.SETUP_SUCCESS, 
                profile: result 
            });
        } catch (error) {
            next (error);
        }
    },

    updateAccount: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const userId = req.user?.userId || ""
            const updates = req.body;
            const files = req.files as {[key:string]: Express.Multer.File[]};
            if(updates.newPassword){
                await userUseCase.updatePassword(userId,updates.newPassword);
            }
            const result = await AccountDetailUseCase.updateProfile(userId, updates,files);
            sendResponse(res, HttpStatusCode.OK, { 
                message: AccountMessages.UPDATE_SUCCESS, 
                profile: result 
              });
        } catch (error) {
            next (error)
        }
    },

    getAccountDetail: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const id = req.user?.userId || ""
            const result = await AccountDetailUseCase.getAccountDetail(id);
            sendResponse(res, HttpStatusCode.OK, { 
                message: AccountMessages.FETCH_SUCCESS, 
                result 
              });
        } catch (error) {
            next (error)
        }
    },

}

