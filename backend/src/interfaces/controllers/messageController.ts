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
            console.log('result', result);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
}