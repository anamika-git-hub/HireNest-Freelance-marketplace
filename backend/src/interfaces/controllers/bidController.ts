import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { BidUseCase } from "../../application/bidUseCase";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import { BidMessages } from "../constants/responseMessages";
import { sendResponse } from "../../utils/responseHandler";

export const BidController = {
    createBid: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const result = await BidUseCase.createBid(data);
            sendResponse(res, HttpStatusCode.CREATED, { 
                message: BidMessages.CREATE_SUCCESS, 
                bid: result 
            });
        } catch (error) {
            next(error);
        }
    },

    updateBid: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const result = await BidUseCase.updateBid(id, updates);
            sendResponse(res, HttpStatusCode.OK, { 
                message: BidMessages.UPDATE_SUCCESS, 
                bid: result 
            });
        } catch (error) {
            next(error);
        }
    },

    deleteBid: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            await BidUseCase.deleteBid(id);
            sendResponse(res, HttpStatusCode.OK, { 
                message: BidMessages.DELETE_SUCCESS 
            });
        } catch (error) {
            next(error);
        }
    },

    getBidsByTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { taskId } = req.params;
            const bids = await BidUseCase.getBidsByTask(taskId);
            sendResponse(res, HttpStatusCode.OK, { 
                message: BidMessages.FETCH_MULTIPLE_SUCCESS, 
                bids 
            });
        } catch (error) {
            next(error);
        }
    },
    getAllBidsByTask: async (req: Req, res: Res, next: Next) => {
        try {
          const taskIds = req.query.taskIds;
          
          const taskIdsArray: string[] = Array.isArray(taskIds) 
            ? taskIds.map(id => String(id))
            : typeof taskIds === 'string' 
              ? [taskIds] 
              : [];
          
          const bids = await BidUseCase.getAllBidsByTask(taskIdsArray);
          sendResponse(res, HttpStatusCode.OK, { 
            message: BidMessages.FETCH_MULTIPLE_SUCCESS, 
            bids 
        });
        } catch (error) {
          next(error);
        }
      },

    getBidById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const bid = await BidUseCase.getBidById(id);
            sendResponse(res, HttpStatusCode.OK, { 
                message: BidMessages.FETCH_SUCCESS, 
                bid 
            });
        } catch (error) {
            next(error);
        }
    },
    BidStatusUpdate:async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const {status} = req.body;
            const updatedBid = await BidUseCase.updateBidStatus(id,status);
            sendResponse(res, HttpStatusCode.OK, { 
                message: BidMessages.UPDATE_SUCCESS, 
                updatedBid 
            });
        } catch (error) {
            next(error);
        }
    },
};
