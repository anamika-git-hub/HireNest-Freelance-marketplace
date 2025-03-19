import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { RequestUseCase } from "../../application/requestUseCase";
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { RequestMessages } from "../constants/responseMessages";

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
  export const RequestController = {
    createRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const result = await RequestUseCase.createRequest(data);
            
            sendResponse(res, HttpStatusCode.CREATED, {
                message: RequestMessages.CREATE_SUCCESS,
                request: result
            });
        } catch (error) {
            next(error);
        }
    },

    updateRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const result = await RequestUseCase.updateRequest(id, updates);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.UPDATE_SUCCESS,
                request: result
            });
        } catch (error) {
            next(error);
        }
    },

    deleteRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            await RequestUseCase.deleteRequest(id);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.DELETE_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    },

    getRequestById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const request = await RequestUseCase.getRequestById(id);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.FETCH_ONE_SUCCESS,
                request
            });
        } catch (error) {
            next(error);
        }
    },
    
    getRequestByUserId: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const userId = req.user?.userId || '';
            const requests = await RequestUseCase.getRequestByUserId(userId);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.FETCH_MANY_SUCCESS,
                requests
            });
        } catch (error) {
            next(error);
        }
    },
    
    getRequestByFreelancerId: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const userId = req.user?.userId || '';
            const requests = await RequestUseCase.getRequestByFreelancerId(userId);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.FETCH_MANY_SUCCESS,
                requests
            });
        } catch (error) {
            next(error);
        }
    },
    
    requestStatusUpdate: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedRequest = await RequestUseCase.updateRequestStatus(id, status);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RequestMessages.UPDATE_SUCCESS,
                updatedRequest
            });
        } catch (error) {
            next(error);   
        }
    }
};
