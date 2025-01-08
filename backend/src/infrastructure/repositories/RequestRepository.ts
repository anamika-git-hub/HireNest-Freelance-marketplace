import { RequestModel } from "../models/RequestModel";
import { IRequest } from "../../entities/RequestForm";

export const RequestRepository = {
    createRequest: async (data: IRequest) => {
        try {
            const request = new RequestModel(data);
            return await request.save();
        } catch (error: any) {
            throw new Error("Error creating request: " + error.message);
        }
    },

    updateRequest: async (id: string, updates: Partial<IRequest>) => {
        try {
            const updateRequest = await RequestModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updateRequest) throw new Error("Request not found");
            return updateRequest;
        } catch (error: any) {
            throw new Error("Error updating request: " + error.message);
        }
    },

    deleteRequest: async (id: string) => {
        try {
            const deleteRequest = await RequestModel.findByIdAndDelete(id);
            if (!deleteRequest) throw new Error("Request not found");
            return deleteRequest;
        } catch (error: any) {
            throw new Error("Error deleting request: " + error.message);
        }
    },

    getRequestByUserId: async (id: string) => {
        try {
            const request = await RequestModel.find({requesterId:id}).populate("freelancerId");
            if (!request) throw new Error("Request not found");
            return request;
        } catch (error: any) {
            throw new Error("Error fetching request: " + error.message);
        }
    },
    getRequestById: async (id: string) => {
        try {
            const request = await RequestModel.findById(id)
            return request
        } catch (error: any) {
            throw new Error("Error fetching request: " + error.message);
        }
    }
};
