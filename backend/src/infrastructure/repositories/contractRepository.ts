import { ContractModel } from "../models/ContractModel";
import { IContract } from "../../entities/contract";
import { FilterCriteria } from "../../entities/filter";
import { IMilestonePayment } from "../../entities/milestonePayment";
import { PaymentModel } from "../models/paymentModel";
import mongoose, {ClientSession} from "mongoose";

export const ContractRepository = {
    createContract: async(data:IContract) =>{
        const contract = new ContractModel(data)
        return await contract.save();
    },
    getContract: async (id: string) => {
        return await ContractModel.findOne({
            $or: [{ bidId: id }, { _id: id }]
        }).populate('freelancerId').populate('clientId');
    },
    updateContract: async(bidId: string, updates: IContract) => {
        return await ContractModel.findOneAndUpdate({bidId},updates,{upsert:true,new: true})
    },
    updateContractStatus: async (id: string, status: string) => {
      try {
        interface UpdateData {
          status: string;
          startDate?: Date;
        }
        const updateData: UpdateData = { status };
        if (status === 'accepted') {
          updateData.status = 'ongoing'
          updateData.startDate = new Date();
        }
        if (status === 'ongoing') {
          updateData.status = 'completed'
        }
        
        const updatedContract = await ContractModel.findOneAndUpdate(
          {$or: [{ bidId: id }, { _id: id }]},
          { $set: updateData },
          { new: true }
        );
        
        return updatedContract;
      } catch (error) {
        console.error('Error updating contract status:', error);
        throw error;
      }
    },
    
    getAllContracts: async (filters:FilterCriteria) => {
      console.log('filters',filters)
        return await ContractModel.find({...filters}).populate('freelancerId');
    },
    updateMilestoneStatus: async (contractId:string,milestoneId:string, status: string, additionalData: any = {}) => {
        try {
            const updateData: any = { 'milestones.$.status': status };
            
            // Add additional data to the update if provided
            if (additionalData.completionDetails) {
              updateData['milestones.$.completionDetails'] = additionalData.completionDetails;
            }
            
            if (additionalData.rejectionReason) {
              updateData['milestones.$.rejectionReason'] = additionalData.rejectionReason;
            }
            
            const updatedContract = await ContractModel.findOneAndUpdate(
              { 
                _id: contractId,
                'milestones._id': milestoneId 
              },
              { $set: updateData },
              { new: true }
            );
            
            return updatedContract;
          } catch (error) {
            console.error('Error updating milestone status:', error);
            throw error;
          }
    },
   // Modify the updateMilestoneWithPayment function to make session optional
updateMilestoneWithPayment: async (
    contractId: string,
    milestoneId: string,
    status: string,
    paymentDetails: any,
    session?: mongoose.ClientSession
  ) => {
    const updateOptions = session ? { session } : {};
    
    return await ContractModel.findOneAndUpdate(
      { 
        _id: contractId,
        "milestones._id": milestoneId 
      },
      { 
        $set: { 
          "milestones.$.status": status,
          "milestones.$.paymentDetails": paymentDetails
        } 
      },
      { new: true, ...updateOptions }
    );
  },
    getContractById: async (contractId: string) => {
        try {
          const contract = await ContractModel.findById(contractId);
          return contract;
        } catch (error) {
          console.error('Error fetching contract:', error);
          throw error;
        }
      },
      getContractByClientAndFreelancer: async (
        contractId: string, 
        taskId: string, 
        freelancerId: string,
        status: string
    ) => {
        return await ContractModel.findOne({
            _id: contractId,
            taskId: taskId,
            freelancerId: freelancerId,
            status: status
        });
    },
    completedMilestones: async() => {
      return await ContractModel.find({
        'milestones.status': 'completed'
      });
    },
    monthlyRevenueAgg: async(sevenMonthsAgo: Date,currentDate: Date) => {
      return await ContractModel.aggregate([
        {
          $unwind: '$milestones'
        },
        {
          $match: {
            'milestones.status': 'completed',
            'milestones.paymentDetails': { $exists: true },
            'milestones.paymentDetails.paymentDate': { 
              $gte: sevenMonthsAgo, 
              $lte: currentDate 
            }
          }
        },
        {
          $project: {
            month: { $month: '$milestones.paymentDetails.paymentDate' },
            year: { $year: '$milestones.paymentDetails.paymentDate' },
            amount: { $toDouble: '$milestones.paymentDetails.amount' },
            platformFee: { $toDouble: '$milestones.paymentDetails.platformFee' }
          }
        },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            revenue: { $sum: '$amount' },
            commission: { $sum: '$platformFee' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);
    },
    recentTransactions: async() => {
      return await ContractModel.aggregate([
        {
          $unwind: '$milestones'
        },
        {
          $match: {
            'milestones.status': 'completed',
            'milestones.paymentDetails': { $exists: true }
          }
        },
        {
          $sort: {
            'milestones.paymentDetails.paymentDate': -1
          }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'userdetails',
            localField: 'clientId',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $lookup: {
            from: 'freelancerprofiles',
            localField: 'freelancerId',
            foreignField: '_id',
            as: 'freelancerDetails'
          }
        },
        {
          $project: {
            id: '$milestones.paymentDetails.id',
            client: { $concat: [{ $arrayElemAt: ['$clientDetails.firstname', 0] }, ' ', { $arrayElemAt: ['$clientDetails.lastname', 0] }] },
            freelancer: { $arrayElemAt: ['$freelancerDetails.name', 0] },
            amount: '$milestones.paymentDetails.amount',
            commission: '$milestones.paymentDetails.platformFee',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$milestones.paymentDetails.paymentDate' } },
            status: 'Completed'
          }
        }
      ]);
    }
}