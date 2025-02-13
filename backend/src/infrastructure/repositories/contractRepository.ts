import { ContractModel } from "../models/ContractModel";
import { IContract } from "../../entities/contract";

export const ContractRepository = {
    createContract: async(data:IContract) =>{
        const contract = new ContractModel(data)
        return await contract.save();
    },
    getContract: async(bidId:string) => {
        return await ContractModel.findOne({bidId});
    },
    updateContract: async(bidId: string, updates: IContract) => {
        return await ContractModel.findOneAndUpdate({bidId},updates,{new: true})
    },
    updateContractStatus: async (bidId: string,status: string) => {
        return await ContractModel.findOneAndUpdate({bidId},{status},{new:true})
    }

}