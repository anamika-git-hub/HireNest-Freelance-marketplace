import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { adminUseCase } from '../../application/adminUseCase';
import { TokenBlacklist } from "../../infrastructure/models/TokenBockList";
import { JwtService } from '../../infrastructure/services/JwtService';
import { FilterCriteria } from '../../entities/filter';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from '../../utils/responseHandler';
import { AdminMessages } from '../constants/responseMessages';

export const AdminController = {
    login: async (req: Req, res: Res, next: Next) => {
        try {
            const {email, password} = req.body;
            const result = await adminUseCase.login(email,password);
            sendResponse(res, HttpStatusCode.OK, {
                message: AdminMessages.LOGIN_SUCCESS,
                ...result
              });
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
            sendResponse(res, HttpStatusCode.OK, {
                message: AdminMessages.FETCH_FREELANCERS_SUCCESS,
                freelancers,
                totalPages
            });
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
            const filters: FilterCriteria = {}
             filters.role = 'client'
            if(searchTerm && searchTerm.trim()) {
                filters.email = {$regex : searchTerm, $options : "i"}
            }
            const clients = await adminUseCase.getAllUsers({filters,skip,limit});
            const totalClients = await adminUseCase.getUsersCount(filters);
            const totalPages = Math.ceil(totalClients/limit)
            sendResponse(res, HttpStatusCode.OK, {
                message: AdminMessages.FETCH_CLIENTS_SUCCESS,
                clients,
                totalPages
            });
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
            const message = isBlocked === 'true' ? AdminMessages.USER_UNBLOCKED : AdminMessages.USER_BLOCKED;
      
            sendResponse(res, HttpStatusCode.OK, {
                message,
                user: updatedUser
            });
        }catch (error){
            next(error)
        }
    },
    getDashboardStats: async(req: Req, res: Res, next: Next) => {
        try {
            const result = await adminUseCase.getDashboardStats();
            sendResponse(res, HttpStatusCode.OK, {
                message: AdminMessages.DASHBOARD_STATS_SUCCESS,
                result
            });
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
            sendResponse(res, HttpStatusCode.OK, {
                message: AdminMessages.TRANSACTION_HISTORY_SUCCESS,
                result
            });
        } catch (error) {
            next(error)
        }
    }
};