import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { adminUseCase } from '../../application/adminUseCase';
import { CategoryUseCase } from '../../application/categoryUseCase';
import { TokenBlacklist } from "../../infrastructure/models/TokenBockList";
import { JwtService } from '../../infrastructure/services/JwtService';



export const AdminController = {
    login: async (req: Req, res: Res, next: Next) => {
        
        try {
            const {email, password} = req.body;
            const result = await adminUseCase.login(email,password);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    getFreelancers: async (req: Req, res: Res, next: Next) => {
        try {
            const freelancers = await adminUseCase.getAllFreelancers();
            res.status(200).json({freelancers});
        } catch (error) {
            next(error);
        }
    },
    getClients: async (req: Req, res: Res, next: Next) => {
        try {
            const clients = await adminUseCase.getAllClients();
            res.status(200).json({clients});
        } catch (error) {
            next(error);
        }
    },

    toggleBlockUser: async (req: Req, res: Res, next: Next) => {
        
        try {
            const {userId, isBlocked} = req.params;
            const isBlockedBool = isBlocked === 'true';
            const updatedUser = await adminUseCase.toggleBlockUser(userId, isBlockedBool);
            if (isBlockedBool) {
                await TokenBlacklist.create({ token: JwtService.getTokenFromRequest(req) });
            }
            res.status(200).json({message: `User ${isBlocked == 'true' ? "unblocked" : "blocked"} scuccessfully`,user: updatedUser});

        }catch (error){
            next(error)
        }
    },
};