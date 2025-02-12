import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { IContract } from "../entities/contract";

export const ContractUseCase = {
    createContract : async(data:IContract)=>{
        return await ContractRepository.createContract(data)
    },
    getContract: async(id: string) => {
        return await ContractRepository.getContract(id)
    },
    updateContract: async (id: string, updatedData:IContract) => {
        return await ContractRepository.updateContract(id,updatedData)
    }
}