import { ContractUseCase } from "../../application/contractUseCase";
import { FilterCriteria } from "../../entities/filter";
import { Req,Res,Next } from "../../infrastructure/types/serverPackageTypes";

export const ContractController = {
    createContract: async(req:Req, res: Res, next:Next) => {
        try {
        const data = req.body
        const result = await ContractUseCase.createContract(data)
        res.status(200).json({result})
        } catch (error) {
           next(error) 
        }
    },

    getContract: async(req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const result = await ContractUseCase.getContract(id);
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    },

    updateContract: async (req: Req,res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const updatedData = req.body;
            const result = await ContractUseCase.updateContract(id,updatedData);
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    },
    updateContractStatus: async (req: Req,res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const {status,taskId} = req.body;
            const result = await ContractUseCase.updateContractStatus(id,status,taskId);
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    },
    getAllContracts: async (req: Req,res: Res, next: Next) => {
        try {
            const taskIds = req.query.taskIds as string [] | undefined;
            const bidIds = req.query.bidIds as string [] | undefined;
            const status = req.query.status as string || "";

            const filters: FilterCriteria = {};
            if (taskIds) filters.taskId = { $in: taskIds};
            if (bidIds) filters.bidId = { $in: bidIds};
            if (status) filters.status = status
            const contracts = await ContractUseCase.getAllContracts(filters);
            res.status(200).json({contracts})
        } catch (error) {
            
        }
    }
}