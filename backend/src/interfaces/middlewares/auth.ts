import { NextFunction, Request, Response } from 'express';
import { JwtService } from "../../infrastructure/services/JwtService";
import checkTokenBlacklist from "./TokenBlocklist";

interface CustomRequest extends Request {
    user?: { userId: string };
}

export const checkAuth = (userRole: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers['authorization'] as string;
            if (!authHeader) {
                res.status(401).send({ message: 'No authorization token provided' });
                return;
            }

            const accessToken = authHeader.split(' ')[1];
            try {
                const userData = JwtService.verifyToken(accessToken) as { id: string, role: string };
                
                if (userRole !== 'user') {
                    if (userData.role !== userRole) {
                        res.status(403).json({ message: 'Insufficient permissions' });
                        return;
                    }
                }
                
                req.user = { userId: userData.id };
                return checkTokenBlacklist(req, res, next);
                
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'TokenExpiredError') {
                        const refreshHeader = req.headers['refreshtoken'] as string;
                        if (!refreshHeader) {
                            res.status(401).json({ message: 'Session expired. Please log in again.' });
                            return;
                        }

                        const refreshToken = refreshHeader.split(' ')[1];
                        try {
                            const refreshData = JwtService.verifyRefreshToken(refreshToken) as { id: string, role: string };
                            
                            if (userRole !== 'user') {
                                if (refreshData.role !== userRole) {
                                    res.status(403).json({ message: 'Insufficient permissions' });
                                    return;
                                }
                            }
                            
                            req.user = { userId: refreshData.id };
                            return checkTokenBlacklist(req, res, next);
                            
                        } catch (refreshError) {
                            res.status(401).json({ message: 'Session expired. Please log in again.' });
                            return;
                        }
                    } else {
                        res.status(401).json({ message: 'Invalid token. Please log in again.' });
                        return;
                    }
                }
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    };
};