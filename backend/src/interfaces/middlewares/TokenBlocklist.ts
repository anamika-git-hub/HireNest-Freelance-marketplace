import { TokenBlacklist } from '../../infrastructure/models/TokenBockList';
import { Req, Res, Next } from '../../infrastructure/types/serverPackageTypes';
import { JwtService } from '../../infrastructure/services/JwtService';
interface CustomRequest extends Req{
    user?:{userId:string};
}
const checkTokenBlacklist = async (req: CustomRequest, res: Res, next: Next): Promise<any> => {
    try {
        const id = req.user?.userId
        const isBlacklisted = await TokenBlacklist.findOne({ _id:id,isBlocked:true});
        
        if (isBlacklisted) {
           return  res.status(403).json({ message: 'User is blocked. Please contact admin.' });
        }

        next(); // Token is valid and not blacklisted, proceed to next middleware or route
    } catch (error) {
         res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export default checkTokenBlacklist;
