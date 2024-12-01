import { ProfileRepository } from "../infrastructure/repositories/ProfileRepository";

export const ProfileUseCase = {
    setupFreelancerProfile: async (data: any) => {
        return await ProfileRepository.createFreelancerProfile(data);
    },

    setupClientProfile: async (data: any) => {
        return await ProfileRepository.createClientProfile(data);

    },

    updateFreelancerProfile: async (id: string, updates: any) => {
        return await ProfileRepository.updateFreelancerProfile(id, updates);
    },

    updateClientProfile: async (id: string, updates: any) => {
        return await ProfileRepository.updateClientProfile (id, updates);
    },

    getProfile: async (userId: string, role: 'freelancer' | 'client') => {
        return await ProfileRepository.findProfileByUserId(userId, role);
    }
};