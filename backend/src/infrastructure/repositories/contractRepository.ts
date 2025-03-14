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
        return await ContractModel.find({...filters}).populate('freelancerId');
    },
    updateMilestoneStatus: async (contractId:string,milestoneId:string, status: string, additionalData: any = {}) => {
        try {
            const updateData: any = { 'milestones.$.status': status };
            
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
    },
    getTransactionHistory: async(period?: string, startDate?: string, endDate?: string, searchTerm?:string, skip?:number, limit?:number) => {
     
      let dateFilter = {};
      
      if (startDate && endDate) {
          dateFilter = {
              'milestones.paymentDetails.paymentDate': {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate)
              }
          };
      } else if (period) {
          const now = new Date();
          let startDateTime;
          
          switch(period) {
              case 'weekly':
                  startDateTime = new Date(now);
                  startDateTime.setDate(now.getDate() - 7);
                  break;
              case 'monthly':
                  startDateTime = new Date(now.getFullYear(), now.getMonth(), 1);
                  break;
              case 'yearly':
                  startDateTime = new Date(now.getFullYear(), 0, 1);
                  break;
              default:
                  startDateTime = null;
          }
          
          if (startDateTime) {
              dateFilter = {
                  'milestones.paymentDetails.paymentDate': { $gte: startDateTime }
              };
          }
          
      }
      
      return await ContractModel.aggregate([
          {
              $unwind: '$milestones'
          },
          {
              $match: {
                  'milestones.status': 'completed',
                  'milestones.paymentDetails': { $exists: true },
                  ...dateFilter
              }
          },
          {
              $sort: {
                  'milestones.paymentDetails.paymentDate': -1
              }
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
                  netAmount: '$milestones.paymentDetails.netAmount',
                  date: { $dateToString: { format: '%Y-%m-%d', date: '$milestones.paymentDetails.paymentDate' } },
                  timestamp: '$milestones.paymentDetails.paymentDate',
                  transactionId: '$milestones.paymentDetails.transactionId',
                  milestoneTitle: '$milestones.title',
                  contractTitle: '$title',
                  status: 'Completed'
              }
          }
      ]);
  },

  getFreelancerEarnings: async(freelancerId:string, startDate:Date, endDate:Date) => {
    const ObjectId = mongoose.Types.ObjectId;
    
    const monthlyEarnings = await ContractModel.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(freelancerId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.status": "completed"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          earnings: { $sum: { $toDouble: "$milestones.paymentDetails.netAmount" } },
          hourly: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "hourly"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          fixed: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "fixed"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          projects: { $addToSet: "$taskId" }
        }
      },
      {
        $project: {
          _id: 1,
          earnings: 1,
          hourly: 1, 
          fixed: 1,
          projects: { $size: "$projects" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const quarterlyEarnings = await ContractModel.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(freelancerId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.status": "completed"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            quarter: { 
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
            }
          },
          earnings: { $sum: { $toDouble: "$milestones.paymentDetails.netAmount" } },
          hourly: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "hourly"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          fixed: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "fixed"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          projects: { $addToSet: "$taskId" }
        }
      },
      {
        $project: {
          _id: 1,
          earnings: 1,
          hourly: 1, 
          fixed: 1,
          projects: { $size: "$projects" }
        }
      },
      { $sort: { "_id.year": 1, "_id.quarter": 1 } }
    ]);
    
    const yearlyEarnings = await ContractModel.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(freelancerId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.status": "completed"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }
          },
          earnings: { $sum: { $toDouble: "$milestones.paymentDetails.netAmount" } },
          hourly: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "hourly"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          fixed: {
            $sum: {
              $cond: [
                { $eq: ["$bidType", "fixed"] },
                { $toDouble: "$milestones.paymentDetails.netAmount" },
                0
              ]
            }
          },
          projects: { $addToSet: "$taskId" }
        }
      },
      {
        $project: {
          _id: 1,
          earnings: 1,
          hourly: 1, 
          fixed: 1,
          projects: { $size: "$projects" }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);
    
    const taskCompletionStats = await ContractModel.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(freelancerId)
        }
      },
      {
        $project: {
          taskId: 1,
          totalMilestones: { $size: "$milestones" },
          completedMilestones: {
            $size: {
              $filter: {
                input: "$milestones",
                as: "milestone",
                cond: { $eq: ["$$milestone.status", "completed"] }
              }
            }
          },
          createdAt: 1
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalMilestones: { $sum: "$totalMilestones" },
          completedMilestones: { $sum: "$completedMilestones" }
        }
      },
      {
        $project: {
          _id: 1,
          completion: {
            $multiply: [
              { $divide: ["$completedMilestones", { $max: ["$totalMilestones", 1] }] },
              100
            ]
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    return { 
      monthlyEarnings, 
      quarterlyEarnings, 
      yearlyEarnings,
      taskCompletionStats
    };
  },
  getClientSpending: async(clientId:string, startDate:Date, endDate:Date) => {
    const ObjectId = mongoose.Types.ObjectId;
    
    const monthlySpending = await ContractModel.aggregate([
      {
        $match: {
          clientId: new ObjectId(clientId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.paymentDetails": { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          spent: { $sum: { $toDouble: "$milestones.paymentDetails.amount" } },
          tasks: { $addToSet: "$taskId" },
          ongoingTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "ongoing"] },
                "$taskId",
                null
              ]
            }
          },
          completedTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$taskId",
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          spent: 1,
          tasks: { $size: "$tasks" },
          ongoing: { 
            $size: { 
              $filter: { 
                input: "$ongoingTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          },
          completed: { 
            $size: { 
              $filter: { 
                input: "$completedTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const quarterlySpending = await ContractModel.aggregate([
      {
        $match: {
          clientId: new ObjectId(clientId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.paymentDetails": { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            quarter: { 
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
            }
          },
          spent: { $sum: { $toDouble: "$milestones.paymentDetails.amount" } },
          tasks: { $addToSet: "$taskId" },
          ongoingTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "ongoing"] },
                "$taskId",
                null
              ]
            }
          },
          completedTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$taskId",
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          spent: 1,
          tasks: { $size: "$tasks" },
          ongoing: { 
            $size: { 
              $filter: { 
                input: "$ongoingTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          },
          completed: { 
            $size: { 
              $filter: { 
                input: "$completedTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.quarter": 1 } }
    ]);
    
    const yearlySpending = await ContractModel.aggregate([
      {
        $match: {
          clientId: new ObjectId(clientId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$milestones" },
      {
        $match: {
          "milestones.paymentDetails": { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }
          },
          spent: { $sum: { $toDouble: "$milestones.paymentDetails.amount" } },
          tasks: { $addToSet: "$taskId" },
          ongoingTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "ongoing"] },
                "$taskId",
                null
              ]
            }
          },
          completedTasks: {
            $addToSet: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$taskId",
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          spent: 1,
          tasks: { $size: "$tasks" },
          ongoing: { 
            $size: { 
              $filter: { 
                input: "$ongoingTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          },
          completed: { 
            $size: { 
              $filter: { 
                input: "$completedTasks", 
                as: "task", 
                cond: { $ne: ["$$task", null] } 
              } 
            } 
          }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);
    
    const taskStatusDistribution = await ContractModel.aggregate([
      {
        $match: {
          clientId: new ObjectId(clientId)
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('monn',monthlySpending,quarterlySpending,yearlySpending,taskStatusDistribution)
    return { 
      monthlySpending, 
      quarterlySpending, 
      yearlySpending,
      taskStatusDistribution
    };
  }
}