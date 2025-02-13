import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
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
    },
    updateContractStatus: async (bidId: string, status: string, taskId:string) => {
        if (status === 'accepted') {
            await TaskRepository.updateTaskStatus(taskId, 'ongoing');
        }else if (status === 'rejected') {
            await TaskRepository.updateTaskStatus(taskId, 'pending');
        }
        return await ContractRepository.updateContractStatus(bidId,status);
    }
}