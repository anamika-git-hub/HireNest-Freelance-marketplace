import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { RequestUseCase } from "../../application/requestUseCase";


interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
export const RequestController = {
    createRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const result = await RequestUseCase.createRequest(data);
            res.status(201).json({ message: "Request created successfully", request: result });
        } catch (error) {
            next(error);
        }
    },

    updateRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const result = await RequestUseCase.updateRequest(id, updates);
            res.status(200).json({ message: "Request updated successfully", request: result });
        } catch (error) {
            next(error);
        }
    },

    deleteRequest: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            await RequestUseCase.deleteRequest(id);
            res.status(200).json({ message: "Request deleted successfully" });
        } catch (error) {
            next(error);
        }
    },

    getRequestById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const request = await RequestUseCase.getRequestById(id);
            res.status(200).json({ message: "Request fetched successfully", request });
        } catch (error) {
            next(error);
        }
    },
    getRequestByUserId: async (req:CustomRequest, res: Res, next: Next) => {
        try {
            const userId = req.user?.userId || '';
            const requests = await RequestUseCase.getRequestByUserId(userId);
            res.status(200).json({ message: "Requests fetched successfully", requests})
        } catch (error) {
            
        }
    }
};
