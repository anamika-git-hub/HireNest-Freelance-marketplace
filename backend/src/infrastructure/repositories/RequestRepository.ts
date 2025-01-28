import { RequestModel } from "../models/RequestModel";
import { IRequest } from "../../entities/RequestForm";

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
            const request = await RequestModel.find({requesterId:id}).populate("freelancerId");
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
            const request = await RequestModel.findById(id)
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
};
