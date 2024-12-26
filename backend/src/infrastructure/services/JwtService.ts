import  jwt from 'jsonwebtoken';
import { Config } from '../../config/config';

const secretKey = Config.JWT_SECRET as string;
const refreshSecretKey = Config.REFRESH_SECRET as string

export const JwtService = {
    generateToken: (payload: object) => jwt.sign(payload, secretKey, {expiresIn: '1h'}),
    generateRefreshToken: (payload: object) => jwt.sign(payload,refreshSecretKey,{expiresIn:'2h'}),
    verifyToken: (token: string) => jwt.verify(token, secretKey),
    verifyRefreshToken:(token:string) => jwt.verify(token,refreshSecretKey),

    getTokenFromRequest: (req: any): string | null => {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            return authorizationHeader.split(' ')[1]; 
        }
        return null; 
    }
};