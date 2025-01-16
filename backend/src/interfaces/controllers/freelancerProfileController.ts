import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { FreelancerProfileUseCase } from '../../application/freelancerProfileUseCase';
interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

export const FreelancerProfileController = {
    createProfile : async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const files = req.files as { [key: string]: Express.Multer.File[]};
            const result = await FreelancerProfileUseCase.createProfile(data, files);
            res.status(201).json({message: 'Profile setup successful', profile: result})
        } catch (error) {
            next (error)

        }
    },

    updateProfile: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const updates = req.body;
            const files = req.files as { [ key: string]: Express.Multer.File[]};
            const id = req.user?.userId || ""
            const result = await FreelancerProfileUseCase.updateProfile(id,updates, files);
            res.status(200).json({message: 'Freelancer profile updated successfully', profile: result})
        } catch (error) {
            next (error);
        }
    },

    getFreelancers: async (req: Req, res: Res, next: Next) => {

        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const sortOption = req.query.sortOption as string || "Relevance";
            const searchTerm = req.query.searchTerm as string || ""; 
            const skip = (page - 1) * limit;

            let sortCriteria: { [key: string]: 1 | -1 } = {};
            if (sortOption === "Price: Low to High") sortCriteria.hourlyRate = 1;
            if (sortOption === "Price: High to Low") sortCriteria.hourlyRate = -1;
            if (sortOption === "Newest") sortCriteria.createdAt = -1;

            const freelancers = await FreelancerProfileUseCase.getFreelancers({sortCriteria,skip,limit,searchTerm});

            const totalFreelancers = await FreelancerProfileUseCase.getFreelancersCount(searchTerm);
            const totalPages = Math.ceil(totalFreelancers/limit)
            res.status(200).json({data:freelancers,totalPages,message: 'Listed freelancers successfully'})
        } catch (error) {
            next(error);
        }
    },

     getFreelancerByUserId: async (req: Req, res: Res, next: Next) => {
            try {
                const {id} = req.params;
                const freelancer = await FreelancerProfileUseCase.getFreelancerByUserId(id);
                res.status(200).json(freelancer);
            } catch (error) {
                next(error); 
            }
        },
        getFreelancerById: async (req: Req, res: Res, next: Next) => {
            try {
                const { id } = req.params; 
                const freelancer = await FreelancerProfileUseCase.getFreelancerById(id);
                res.status(200).json({ freelancer, message: 'Task fetched successfully' });
            } catch (error) {
                next(error); 
            }
        }
}