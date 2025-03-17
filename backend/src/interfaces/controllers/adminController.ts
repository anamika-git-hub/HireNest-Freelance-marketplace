import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { adminUseCase } from '../../application/adminUseCase';
import { CategoryUseCase } from '../../application/categoryUseCase';
import { TokenBlacklist } from "../../infrastructure/models/TokenBockList";
import { JwtService } from '../../infrastructure/services/JwtService';
import { FilterCriteria } from '../../entities/filter';



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
            const page = parseInt(req.query.page as string,10) || 1;
            const limit = parseInt(req.query.limit as string,10) || 10;
            const searchTerm = req.query.searchTerm as string || "";

            const skip = (page - 1)* limit;
            const filters: FilterCriteria = {}
             filters.role = 'freelancer'
            if(searchTerm && searchTerm.trim()) {
                filters.email = {$regex : searchTerm, $options : "i"}
            }
            const freelancers = await adminUseCase.getAllUsers({filters, skip, limit});
            const totalFreelancers = await adminUseCase.getUsersCount(filters);
            const totalPages = Math.ceil(totalFreelancers/limit);
            res.status(200).json({freelancers,totalPages});
        } catch (error) {
            next(error);
        }
    },
    getClients: async (req: Req, res: Res, next: Next) => {
        try {
            const page = parseInt(req.query.page as string,10) || 1;
            const limit = parseInt(req.query.limit as string,10) || 10;
            const searchTerm = req.query.searchTerm as string || "";

            const skip = (page - 1)* limit;
            const filters: any = {}
             filters.role = 'client'
            if(searchTerm && searchTerm.trim()) {
                filters.email = {$regex : searchTerm, $options : "i"}
            }
            const clients = await adminUseCase.getAllUsers({filters,skip,limit});
            const totalClients = await adminUseCase.getUsersCount(filters);
            const totalPages = Math.ceil(totalClients/limit)
            res.status(200).json({clients,totalPages});
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
    getDashboardStats: async(req: Req, res: Res, next: Next) => {
        try {
            const result = await adminUseCase.getDashboardStats();
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    },
    getTransactionHistory: async(req: Req, res: Res, next: Next) => {
        try {
            const { period, startDate, endDate } = req.query;
            const page = parseInt(req.query.page as string , 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const searchTerm = req.query.searchTerm as string || '';
            const skip = (page-1) * limit;
            const result = await adminUseCase.getTransactionHistory(period as string, startDate as string, endDate as string,searchTerm,skip,limit);
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    }
};