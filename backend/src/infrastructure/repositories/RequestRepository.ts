import { RequestModel } from "../models/RequestModel";
import { IRequest } from "../../entities/RequestForm";
import mongoose from "mongoose";

export const RequestRepository = {
    createRequest: async (data: IRequest) => {
        try {
            const request = new RequestModel(data);
            return await request.save();
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create request: ${error.message}`);
            }else {
                throw new Error(`Failed to create request due to an unknown error`);
            } 
        }
    },

    updateRequest: async (id: string, updates: Partial<IRequest>) => {
        try {
            const updateRequest = await RequestModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updateRequest) throw new Error("Request not found");
            return updateRequest;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update request: ${error.message}`);
            }else {
                throw new Error(`Failed to update request due to an unknown error`);
            } 
        }
    },

    deleteRequest: async (id: string) => {
        try {
            const deleteRequest = await RequestModel.findByIdAndDelete(id);
            if (!deleteRequest) throw new Error("Request not found");
            return deleteRequest;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to delete request: ${error.message}`);
            }else {
                throw new Error(`Failed to delete request due to an unknown error`);
            } 
        }
    },

    getRequestByUserId: async (id: string) => {
        try {
            const request = await RequestModel.find({requesterId:id})
            if (!request) throw new Error("Request not found");
            return request;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get request by userId: ${error.message}`);
            }else {
                throw new Error(`Failed to get request by userId due to an unknown error`);
            } 
        }
    },
    getRequestById: async (id: string) => {
        try {
            const request = await RequestModel.findById(id).populate('freelancerId')
            return request
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get request by Id: ${error.message}`);
            }else {
                throw new Error(`Failed to get request by Id due to an unknown error`);
            } 
        }
    },
    getRequestByFreelancerId: async (id: string) => {
        try {
            const request = await RequestModel.find({freelancerId:id})
            if (!request) throw new Error("Request not found");
            return request;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get request by userId: ${error.message}`);
            }else {
                throw new Error(`Failed to get request by userId due to an unknown error`);
            } 
        }
    },

    updateRequestStatus: async (id: string, status:string) => {
        try {
            const updatedRequest = await RequestModel.findByIdAndUpdate(id,{status}, {new:true});
            if(!updatedRequest) throw new Error ('Request not found');
            return updatedRequest;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update the request: ${error.message}`);
            }else {
                throw new Error(`Failed to update request due to an unknown error`)
            }
        }
    },
    getClientRequestStats: async (clientId: string, startDate: Date, endDate: Date) => {
    try {
      const monthlyRequests = await RequestModel.aggregate([
        {
          $match: {
            requesterId: new mongoose.Types.ObjectId(clientId),
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            requestsSubmitted: { $sum: 1 },
            requestsAccepted: {
              $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      const quarterlyRequests = await RequestModel.aggregate([
        {
          $match: {
            requesterId: new mongoose.Types.ObjectId(clientId),
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              quarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } }
            },
            requestsSubmitted: { $sum: 1 },
            requestsAccepted: {
              $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id.year": 1, "_id.quarter": 1 } }
      ]);
  
      const yearlyRequests = await RequestModel.aggregate([
        {
          $match: {
            requesterId: new mongoose.Types.ObjectId(clientId),
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" } },
            requestsSubmitted: { $sum: 1 },
            requestsAccepted: {
              $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id.year": 1 } }
      ]);
  
      return {
        monthlyRequests,
        quarterlyRequests,
        yearlyRequests
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get client request stats: ${error.message}`);
      } else {
        throw new Error(`Failed to get client request stats due to an unknown error`);
      }
    }
  }
};
