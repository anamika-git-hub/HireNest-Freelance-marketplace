import { ContractUseCase } from "../../application/contractUseCase";
import { FilterCriteria } from "../../entities/filter";
import { Req,Res,Next } from "../../infrastructure/types/serverPackageTypes";
import { sendNotification } from "../..";
import { uploadToS3 } from "../../utils/uploader";
import { PaymentUseCase } from "../../application/paymentUseCase";
import mongoose from "mongoose";
import { FreelancerProfileRepository } from "../../infrastructure/repositories/FreelancerProfileRepository";
import { AccountDetailRepository } from "../../infrastructure/repositories/accountDetail";
import { NotificationRepository } from "../../infrastructure/repositories/notificationRepository";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import { sendResponse } from "../../utils/responseHandler";
import { ContractMessages } from "../constants/responseMessages";

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
  
  export const ContractController = {
    createContract: async(req: Req, res: Res, next: Next) => {
      try {
        const data = req.body;
        const result = await ContractUseCase.createContract(data);
        sendResponse(res, HttpStatusCode.CREATED, {
          message: ContractMessages.CREATE_SUCCESS,
          result
        });
      } catch (error) {
        next(error);
      }
    },
  
    getContract: async(req: Req, res: Res, next: Next) => {
      try {
        const { id } = req.params;
        const result = await ContractUseCase.getContract(id);
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.FETCH_SUCCESS,
          result
        });
      } catch (error) {
        next(error);
      }
    },
  
    updateContract: async (req: Req, res: Res, next: Next) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await ContractUseCase.updateContract(id, updatedData);
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.UPDATE_SUCCESS,
          result
        });
      } catch (error) {
        next(error);
      }
    },
  
    updateContractStatus: async (req: Req, res: Res, next: Next) => {
      try {
        const { id } = req.params;
        const { status, taskId, contractId } = req.body;
        let result;
        
        if(contractId) {
          result = await ContractUseCase.updateContractStatus(contractId, status, taskId);
        } else {
          result = await ContractUseCase.updateContractStatus(id, status, taskId);
        }
        
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.STATUS_UPDATE_SUCCESS,
         result
        });
      } catch (error) {
        next(error);
      }
    },
  
    getAllContracts: async (req: Req, res: Res, next: Next) => {
      try {
        const taskIds = req.query.taskIds as string[] | undefined;
        const freelancerId = req.query.freelancerId as string | "";
        const clientId = req.query.clientId as string | "";
        const bidIds = req.query.bidIds as string[] | undefined;
        const status = req.query.status as string || "";
        const filters: FilterCriteria = {};
        
        if (taskIds) filters.taskId = { $in: taskIds.map(id => new mongoose.Types.ObjectId(id)) };
        if (bidIds) filters.bidId = { $in: bidIds.map(id => new mongoose.Types.ObjectId(id)) };
        
        if (status) {
          if(status === 'filter') {
            filters.status = { $in: ['ongoing', 'completed'] };
          } else {
            filters.status = status;
          }
        }
        
        if(freelancerId) {
          const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(freelancerId);
          filters.freelancerId = freelancerProfile ? freelancerProfile._id.toString() : undefined;
        }
        
        if(clientId) {
          const accountDetail = await AccountDetailRepository.findUserDetailsById(clientId);
          filters.clientId = accountDetail ? accountDetail._id.toString() : undefined;
        }
        
        const contracts = await ContractUseCase.getAllContracts(filters);
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.FETCH_MULTIPLE_SUCCESS,
          contracts
        });
      } catch (error) {
        next(error);
      }
    },
  
    submitMilestone: async(req: Req, res: Res, next: Next) => {
      try {
        const { contractId, milestoneId, description } = req.body;
        
        const uploadImage = async (file: Express.Multer.File, folderName: string) => {
          try {
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            return await uploadToS3(
              file.buffer,
              `${folderName}/${uniqueFileName}`
            );
          } catch (error) {
            console.error(`Error uploading to S3:`, error);
            throw new Error(`Failed to upload file to S3`);
          }
        };
        
        const uploadResult = req.file ? 
          await uploadImage(req.file, 'milestoneSubmit') : null;
          
        const submissionDetails = {
          description,
          fileUrl: uploadResult?.Location ?? null,
          fileName: req.file?.filename,
          submittedAt: new Date().toISOString()
        };
        
        const result = await ContractUseCase.submitMilestone(contractId, milestoneId, submissionDetails);
        
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.MILESTONE_SUBMIT_SUCCESS,
          success: true,
          result
        });
      } catch (error) {
        next(error);
      }
    },
  
    acceptMilestone: async(req: Req, res: Res, next: Next) => {
      try {
        const { contractId, milestoneId } = req.body;
        const contract = await ContractUseCase.getContractDetails(contractId);
        const result = await ContractUseCase.acceptMilestone(contractId, milestoneId);
        console.log('ree',result)
        const payment = await PaymentUseCase.releaseEscrow(contractId, milestoneId, contract.freelancerId);
        console.log('ppp',payment)
       
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.MILESTONE_ACCEPT_SUCCESS,
          success: true,
          result
        });
      } catch (error) {
        next(error);
      }
    },
  
    rejectMilestone: async(req: CustomRequest, res: Res, next: Next) => {
      try {
        const { contractId, milestoneId, rejectionReason } = req.body;
        const contract = await ContractUseCase.getContractDetails(contractId);
        const result = await ContractUseCase.rejectMilestone(
          contractId, 
          milestoneId, 
          rejectionReason || 'No reason provided'
        );
        
        const userId = req.user?.userId || "";
        
        if(result) {
          const notificationData = {
            senderId: userId,
            userId: contract.freelancerId,
            role: 'freelancer',
            text: `Your milestone submission has been rejected: ${result.milestoneTitle}`,
            types: 'milestone_rejected',
            isRead: false,
            createdAt: new Date(),
          };
          
          await NotificationRepository.createNotification(notificationData);
          sendNotification(contract.freelancerId.toString(), {
            ...notificationData
          });
        }
        
        sendResponse(res, HttpStatusCode.OK, {
          message: ContractMessages.MILESTONE_REJECT_SUCCESS,
          success: true,
          result
        });
      } catch (error) {
        next(error);
      }
    }
  };