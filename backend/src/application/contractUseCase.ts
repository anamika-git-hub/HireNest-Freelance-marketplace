import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { IContract, IMilestoneSubmissionForm } from "../entities/contract";
import { FilterCriteria } from "../entities/filter";
import { BidRepository } from "../infrastructure/repositories/BidRepository";
import { NotificationRepository } from "../infrastructure/repositories/notificationRepository";
import { sendNotification } from "..";

const getNotificationText = (status: 'accepted' | 'rejected', projectName:string):string => {
  const messages = {
    accepted: `Congratulations! Your contract for the project ${projectName} has been accepted by the freelancer.`,
    rejected: `We regret to inform you that the freelancer has rejected your contract for ${projectName},`
  } as const;
  return messages[status];
}

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
    updateContractStatus: async (id: string, status: string, taskId:string) => {
        if (status === 'accepted') {
            await TaskRepository.updateTaskStatus(taskId, 'ongoing');
        }else if (status === 'rejected') {
            await TaskRepository.updateTaskStatus(taskId, 'pending');
        }else if (status === 'ongoing') {
          await TaskRepository.updateTaskStatus(taskId,'completed')
        }
        if (status === 'accepted' || status === 'rejected') {
          const senderId = (await BidRepository.getBidById(id)).bidderId
          const {clientId, projectName} = await TaskRepository.getTaskById(taskId)
          const notificationData = {
            senderId,
            userId:clientId,
            role:'client',
            projectName,
            text: getNotificationText(status,projectName),
            isRead: false,
            createdAt: new Date(),
            types:status === 'accepted'?'contract_accepted': 'contract_rejected',
            projectUrl: `/client/bidders-list/${taskId}`
          };
          await NotificationRepository.createNotification(notificationData);

          sendNotification(clientId.toString(),{
            ...notificationData,
            text:getNotificationText(status === 'accepted'? 'rejected' : 'accepted',projectName),
          })
        }
        return await ContractRepository.updateContractStatus(id,status);
    },
    getAllContracts: async (filters:FilterCriteria) => {
        return await ContractRepository.getAllContracts(filters);
    },
    submitMilestone: async(contractId:string, milestoneId: string, submissionDetails:IMilestoneSubmissionForm) => {
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
 
             if(updatedContract){
              const contract = await ContractRepository.getContractById(contractId);
                   if(!contract) throw new Error('contract not found');
                   const {taskId,bidId} = contract;
                   const bid = await BidRepository.getBidById(bidId.toString());
                   if(!bid) throw new Error("Bid not found");
                    const {bidderId} = bid;
                    const task = await TaskRepository.getTaskById(taskId.toString());
                    if(!task) throw new Error("Task not found");
                    const {clientId,projectName} = task;
                 const notificationData = {
                     senderId:bidderId,
                     userId:clientId,
                     role:'client',
                     types:'milestone_submission',
                     createdAt: new Date(),
                     isRead: false,
                     projectUrl:`/client/client-contract/${contractId}`,
                     projectName:projectName,
                     text:`A freelancer has submitted a milestone of the project ${projectName} for a review.`,
                 }
                 await NotificationRepository.createNotification(notificationData);
                 sendNotification(clientId.toString(), {
                    ...notificationData
                 })
             }           
            return {
                success: true,
                milestoneTitle: milestone.title,
                clientId: contract.clientId,
                projectName: contract.title
            };
        } catch (error) {
          if(error instanceof Error){
            throw new Error(`Error submitting milestone:${error.message}`)
          }else {
              throw new Error(`Error submitting milestone due to an unknown error`);
          }
            
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
           console.log('ccc',contract)
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
          
            if(updatedContract){
              const {taskId,bidId} = contract;
              const bid = await BidRepository.getBidById(bidId.toString());
              if(!bid) throw new Error("Bid not found");
               const {bidderId} = bid;
               const task = await TaskRepository.getTaskById(taskId.toString());
               if(!task) throw new Error("Task not found");
               const {clientId,projectName} = task;  
               console.log('oooooooooo',bidderId,clientId,projectName)    
                const notificationData = {
                    senderId:clientId,
                    userId: bidderId,
                    role:'freelancer',
                    types:'milestone_accepted',
                    projectName,
                    projectUrl:`/freelancer/freelancer-contract/${contractId}`,
                    text:`Your milestone submission for the project ${projectName} has been accepted.`,
                    isRead: false,
                    createdAt: new Date(),

                }
                console.log('nnnnnn',notificationData)
                await NotificationRepository.createNotification(notificationData)
                sendNotification(bidderId.toString(),{
                    ...notificationData 
                });
            }          
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