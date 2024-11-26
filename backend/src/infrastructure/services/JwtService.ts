import  jwt from 'jsonwebtoken';
import { Config } from '../../config/config';

const secretKey = Config.JWT_SECRET as string;

export const JwtService = {
    generateToken: (payload: object) => jwt.sign(payload, secretKey, {expiresIn: '1h'}),
    verifyToken: (token: string) => jwt.verify(token, secretKey)
};