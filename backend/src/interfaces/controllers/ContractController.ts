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
            console.log('iiii',id)
            const result = await ContractUseCase.getContract(id);
            console.log('rrrr',result)
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    },

    updateContract: async (req: Req,res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const updatedData = req.body;
            console.log('uuuuuuuuu',id,updatedData)
            const result = await ContractUseCase.updateContract(id,updatedData);
            res.status(200).json({result})
        } catch (error) {
            next(error)
        }
    }
}