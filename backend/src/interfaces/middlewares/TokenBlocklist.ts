import { TokenBlacklist } from '../../infrastructure/models/TokenBockList';
import { Req, Res, Next } from '../../infrastructure/types/serverPackageTypes';
import { JwtService } from '../../infrastructure/services/JwtService';

const checkTokenBlacklist = async (req: Req, res: Res, next: Next): Promise<void> => {
    try {
        const token = JwtService.getTokenFromRequest(req);
        
        if (!token) {
             res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const isBlacklisted = await TokenBlacklist.findOne({ token });
        
        if (isBlacklisted) {
             res.status(403).json({ message: 'User is blocked. Please contact admin.' });
        }

        next(); // Token is valid and not blacklisted, proceed to next middleware or route
    } catch (error) {
         res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export default checkTokenBlacklist;
