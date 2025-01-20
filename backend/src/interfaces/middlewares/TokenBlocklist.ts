import { Response } from 'express'; 
import { Req, Next } from '../../infrastructure/types/serverPackageTypes';
import { TokenBlacklist } from '../../infrastructure/models/TokenBockList';

interface CustomRequest extends Req {
    user?: { userId: string };
}

const checkTokenBlacklist = async (req: CustomRequest, res: Response, next: Next): Promise<void> => {
    try {
        const id = req.user?.userId;
        const isBlacklisted = await TokenBlacklist.findOne({ _id: id, isBlocked: true });

        if (isBlacklisted) {
            res.status(403).json({ message: 'User is blocked. Please contact admin.' });
            return; 
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export default checkTokenBlacklist;
