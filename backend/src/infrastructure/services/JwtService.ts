import  jwt from 'jsonwebtoken';
import { Config } from '../../config/config';

const secretKey = Config.JWT_SECRET as string;

export const JwtService = {
    generateToken: (payload: object) => jwt.sign(payload, secretKey, {expiresIn: '1h'}),
    verifyToken: (token: string) => jwt.verify(token, secretKey),
    getTokenFromRequest: (req: any): string | null => {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            return authorizationHeader.split(' ')[1]; 
        }
        return null; 
    }
};