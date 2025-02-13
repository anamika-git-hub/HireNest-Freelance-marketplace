import { ContractUseCase } from "../../application/contractUseCase";
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
    }
}