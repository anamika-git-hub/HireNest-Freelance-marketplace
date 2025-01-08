import { RequestRepository } from "../infrastructure/repositories/RequestRepository";
import { IRequest } from "../entities/RequestForm";

export const RequestUseCase = {
    createRequest: async (data: IRequest) => {
        try {
            return await RequestRepository.createRequest(data);
        } catch (error: any) {
            throw new Error(`Failed to create request: ${error.message}`);
        }
    },

    updateRequest: async (
        id: string,
        updates: Partial<IRequest>,
    ) => {
        try {
            return await RequestRepository.updateRequest(id, updates);
        } catch (error: any) {
            throw new Error(`Failed to update request: ${error.message}`);
        }
    },

    deleteRequest: async (id: string) => {
        return await RequestRepository.deleteRequest(id);
    },

    getRequestById: async (id: string) => {
        return await RequestRepository.getRequestById(id);
    },
    getRequestByUserId: async (id:string) => {
        return await RequestRepository.getRequestByUserId(id);
    }
};
