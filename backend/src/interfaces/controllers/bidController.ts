import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { BidUseCase } from "../../application/bidUseCase";

export const BidController = {
    createBid: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const result = await BidUseCase.createBid(data);
            res.status(201).json({ message: "Bid created successfully", bid: result });
        } catch (error) {
            next(error);
        }
    },

    updateBid: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            console.log(id,updates)

            const result = await BidUseCase.updateBid(id, updates);
            res.status(200).json({ message: "Bid updated successfully", bid: result });
        } catch (error) {
            next(error);
        }
    },

    deleteBid: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            await BidUseCase.deleteBid(id);
            res.status(200).json({ message: "Bid deleted successfully" });
        } catch (error) {
            next(error);
        }
    },

    getBidsByTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { taskId } = req.params;
            const bids = await BidUseCase.getBidsByTask(taskId);
            res.status(200).json({ message: "Bids fetched successfully", bids });
        } catch (error) {
            next(error);
        }
    },

    getBidById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const bid = await BidUseCase.getBidById(id);
            res.status(200).json({ message: "Bid fetched successfully", bid });
        } catch (error) {
            next(error);
        }
    },
    BidStatusUpdate:async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const {status} = req.body;
            const updatedBid = await BidUseCase.updateBidStatus(id,status);
            res.status(200).json({ message: "Bid updated successfully", updatedBid });
        } catch (error) {
            next(error);
        }
    },
};
