import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { AccountDetailUseCase } from '../../application/accountDetailUseCase';
import { userUseCase } from '../../application/userUseCase';
interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
export const AccountDetailController = {
    setUpAccount: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const files = req.files as { [key: string]: Express.Multer.File[] };
        
            const result = await AccountDetailUseCase.setUpProfile(data, files);
            res.status(201).json({ message: "Profile setup successful", profile: result });
        } catch (error) {
            next (error);
        }
    },
    updateAccount: async (req: CustomRequest, res: Res, next: Next) => {
        try {
             const userId = req.user?.userId || ""
            const updates = req.body;
            const files = req.files as {[key:string]: Express.Multer.File[]};
            await userUseCase.updatePassword(userId,updates.newPassword);
            const result = await AccountDetailUseCase.updateProfile(userId, updates,files);
            res.status(200).json({message: 'Profile updated Successfully', profile: result})
        } catch (error) {
            next (error)
        }
    },

    getAccountDetail: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const id = req.user?.userId || ""
            const result = await AccountDetailUseCase.getAccountDetail(id);
            res.status(200).json(result)
        } catch (error) {
            
        }
    }

}

