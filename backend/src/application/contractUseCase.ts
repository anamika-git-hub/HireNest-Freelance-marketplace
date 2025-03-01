import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { IContract } from "../entities/contract";
import { FilterCriteria } from "../entities/filter";
import mongoose from "mongoose";
import { FreelancerReviewRepository } from "../infrastructure/repositories/freelancerReviewRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";

export const ContractUseCase = {
    createContract : async(data:IContract)=>{
        return await ContractRepository.createContract(data)
    },
    getContract: async(id:string) => {
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
    },
    getAllContracts: async (filters:FilterCriteria) => {
        return await ContractRepository.getAllContracts(filters);
    },
    submitMilestone: async(contractId:string, milestoneId: string, submissionDetails: any) => {
        try {
            const contract = await ContractRepository.getContractById(contractId);
            if(!contract){
                throw new Error('Contract not found');
            }
            const milestone = contract.milestones.find(m=> m._id.toString() === milestoneId);
            if(!milestone){
                throw new Error('Milestone not found');
            }
            if(milestone.status !== 'active') {
                throw new Error("Milestone is not in active status");
            };
            const updatedContract = await ContractRepository.updateMilestoneStatus(
                contractId,
                milestoneId,
                'review',
                {
                    completionDetails: {
                        description: submissionDetails.description,
                        files: submissionDetails.fileUrl? [{
                            fileName: submissionDetails.fileName,
                            fileUrl: submissionDetails.fileUrl
                        }] : [],
                        submittedAt: submissionDetails.submittedAt
                    }
                }
            );
            return {
                success: true,
                milestoneTitle: milestone.title,
                clientId: contract.clientId
            };
        } catch (error:any) {
            throw new Error(`Error submitting milestone:${error}`)
        }
    },
    getContractDetails:async(contractId:string) => {
        try {
            const contract = await ContractRepository.getContractById(contractId);
            if (!contract) {
              throw new Error('Contract not found');
            }
            
            return contract;
          } catch (error) {
            console.error('Error getting contract details:', error);
            throw error;
          }
    },
    acceptMilestone :async (contractId: string, milestoneId: string) => {
        try {
          const contract = await ContractRepository.getContractById(contractId);
          if (!contract) {
            throw new Error('Contract not found');
          }
    
          const milestone = contract.milestones.find(m => m._id.toString() === milestoneId);
          if (!milestone) {
            throw new Error('Milestone not found');
          }
    
          if (milestone.status !== 'review') {
            throw new Error('Milestone is not in review status');
          }
    
          const updatedContract = await ContractRepository.updateMilestoneStatus(
            contractId,
            milestoneId,
            'accepted',
            {}
          );
          const allCompleted = updatedContract?.milestones.every(
            m => m.status === 'completed'
          );
          
          if (allCompleted) {
            await ContractRepository.updateContractStatus(contractId, 'completed');
          }
    
          return {
            success: true,
            milestoneTitle: milestone.title
          };
        } catch (error) {
          console.error('Error accepting milestone:', error);
          throw error;
        }
    },
    rejectMilestone: async (contractId: string, milestoneId: string, rejectionReason: string) => {
        try {
          const contract = await ContractRepository.getContractById(contractId);
          if (!contract) {
            throw new Error('Contract not found');
          }
    
          const milestone = contract.milestones.find(m => m._id.toString() === milestoneId);
          if (!milestone) {
            throw new Error('Milestone not found');
          }
    
          if (milestone.status !== 'review') {
            throw new Error('Milestone is not in review status');
          }
    
          const updatedContract = await ContractRepository.updateMilestoneStatus(
            contractId,
            milestoneId,
            'active',
            { rejectionReason }
          );
    
          return {
            success: true,
            milestoneTitle: milestone.title
          };
        } catch (error) {
          console.error('Error rejecting milestone:', error);
          throw error;
        }
      },
      completeContract: async (contractId: string) => {
        try {
          const updatedContract = await ContractRepository.updateContractStatus(contractId, 'completed');
          return { success: true };
        } catch (error) {
          console.error('Error completing contract:', error);
          throw error;
        }
      },
     

}