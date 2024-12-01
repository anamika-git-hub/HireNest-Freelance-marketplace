import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { ProfileUseCase } from '../../application/profileUseCase';

export const ProfileController = {
    setupProfile: async (req: Req, res: Res, next: Next) => {
        try{
            const { role, ...data} = req.body;
            let result;
            if(role === 'freelancer'){
                result = await ProfileUseCase.setupFreelancerProfile(data);
            }else if (role === 'client') {
                result = await ProfileUseCase.setupClientProfile(data);
            }else {
                throw new Error('Invalid role specified');
            }
            res.status(201).json({message: 'Profile setup successfull', profile: result})
        } catch (error){
            next (error);
        }
    },
    updateProfile: async (req: Req, res: Res, next: Next) => {
        try {
            const { role, id, updates } = req.body;
            let result;

            if (role === 'freelancer') {
                result = await ProfileUseCase.updateFreelancerProfile(id, updates);
            } else if (role === 'client') {
                result = await ProfileUseCase.updateClientProfile(id, updates);
            } else {
                throw new Error('Invalid role specified');
            }

            res.status(200).json({ message: "Profile updated successfully", profile: result });
        } catch (error) {
            next(error);
        }
    },

    getProfile: async (req: Req, res: Res, next: Next) => {
        try {
            const {userId, role} = req.params;

            if (role !== 'freelancer' && role !== 'client') {
                throw new Error('Invalid role specified. Must be "freelancer" or "client".');
            }
            const profile = await ProfileUseCase.getProfile(userId,role);
            res.status(200).json({profile});
        } catch (error) { 
            next (error)
        }
    }
}