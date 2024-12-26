import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { FreelancerProfileUseCase } from '../../application/freelancerProfileUseCase';

export const FreelancerProfileController = {
    createProfile : async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            console.log('data:',data)
            const files = req.files as { [key: string]: Express.Multer.File[]};
            console.log('files',files)
            

            const result = await FreelancerProfileUseCase.createProfile(data, files);
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

            const result = await FreelancerProfileUseCase.updateProfile(id,updates, files);
            res.status(200).json({message: 'Freelancer profile updated successfully', profile: result})
        } catch (error) {
            next (error);
        }
    },

    getFreelancers: async (req: Req, res: Res, next: Next) => {
        try {
            const freelancers = await FreelancerProfileUseCase.getFreelancers();
            res.status(200).json({data:freelancers,message: 'Listed freelancers successfully'})
        } catch (error) {
            next(error);
        }
    },

     getFreelancerByUserId: async (req: Req, res: Res, next: Next) => {
            try {
                const { id } = req.params; 
                console.log('idddd',id)
                const freelancer = await FreelancerProfileUseCase.getFreelancerByUserId(id);
                console.log('ffffff',freelancer)
                res.status(200).json(freelancer);
            } catch (error) {
                next(error); 
            }
        },
        getFreelancerById: async (req: Req, res: Res, next: Next) => {
            try {
                const { id } = req.params; // Task ID
                const freelancer = await FreelancerProfileUseCase.getFreelancerById(id);
                res.status(200).json({ freelancer, message: 'Task fetched successfully' });
            } catch (error) {
                next(error); 
            }
        }
}