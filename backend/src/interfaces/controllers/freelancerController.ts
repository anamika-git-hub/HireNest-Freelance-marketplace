import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { FreelancerUseCase } from '../../application/freelancerUseCase';

export const FreelancerController = {
    createProfile : async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            console.log('data:',data)
            const files = req.files as { [key: string]: Express.Multer.File[]};
            

            const result = await FreelancerUseCase.createProfile(data, files);
            res.status(201).json({message: 'Profile setup successful', profile: result})
        } catch (error) {
            console.log('errr:', error);
            
            next (error)

        }
    },

    updateProfile: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const updates = req.body;
            const files = req.files as { [ key: string]: Express.Multer.File[]};

            const result = await FreelancerUseCase.updateProfile(id,updates, files);
            res.status(200).json({message: 'Freelancer profile updated successfully', profile: result})
        } catch (error) {
            next (error);
        }
    }
}