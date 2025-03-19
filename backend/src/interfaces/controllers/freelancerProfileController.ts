import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { FreelancerProfileUseCase } from '../../application/freelancerProfileUseCase';
import { FilterCriteria } from '../../entities/filter';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { FreelancerProfileMessages } from '../constants/responseMessages';

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
  
  export const FreelancerProfileController = {
    createProfile : async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body;
            const files = req.files as { [key: string]: Express.Multer.File[]};
            const result = await FreelancerProfileUseCase.createProfile(data, files);
            
            sendResponse(res, HttpStatusCode.CREATED, {
                message: FreelancerProfileMessages.CREATE_SUCCESS,
                profile: result
            });
        } catch (error) {
            next(error);
        }
    },

    updateProfile: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const updates = req.body;
            const files = req.files as { [key: string]: Express.Multer.File[]};
            const id = req.user?.userId || "";
            const result = await FreelancerProfileUseCase.updateProfile(id, updates, files);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: FreelancerProfileMessages.UPDATE_SUCCESS,
                profile: result
            });
        } catch (error) {
            next(error);
        }
    },

    getFreelancers: async (req: Req, res: Res, next: Next) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const sortOption = req.query.sortOption as string || "Relevance";
            const searchTerm = req.query.searchTerm as string || ""; 
            
            const experience = req.query.experience as string | undefined;
            const skills = req.query.skills as string[] | undefined; 
            const priceRange = req.query.priceRange as { min: string; max: string } | undefined;
            const bookmarkedFreelancerIds = req.query.bookmarkedFreelancerIds as string[] | undefined;
            const skip = (page - 1) * limit;

            let sortCriteria: { [key: string]: 1 | -1 } = {};
            if (sortOption === "Price: Low to High") sortCriteria.hourlyRate = 1;
            if (sortOption === "Price: High to Low") sortCriteria.hourlyRate = -1;
            if (sortOption === "Newest") sortCriteria.createdAt = -1;
            if (sortOption === "Rating: High to Low") sortCriteria.rating = -1;

            const filters: FilterCriteria = {};

            if (searchTerm && searchTerm.trim()) {
                filters.$or = [
                    { name: { $regex: searchTerm, $options: "i" } }, 
                    { tagline : { $regex: searchTerm, $options: "i"} },
                ];
            }

            if (bookmarkedFreelancerIds) {
                filters._id = { $in: bookmarkedFreelancerIds };
            }
            
            if (experience) {
                const experienceMatch = experience.match(/^(\d+)(?:\+)?(?:-(\d+))?/);
                if (experienceMatch) {
                    const minExperience = parseInt(experienceMatch[1], 10); 
                    const maxExperience = experienceMatch[2] ? parseInt(experienceMatch[2], 10) : undefined; 
    
                    filters.experience = {
                        $gte: `${minExperience} months`,
                        ...(maxExperience && { $lte: `${maxExperience} years` }), 
                    };
                }
            }
            
            if (skills) filters.skills = { $all: skills };
            
            if (priceRange) {
                const minRate = parseFloat(priceRange.min);
                const maxRate = parseFloat(priceRange.max);
                if (!isNaN(minRate)) filters.hourlyRate = { ...filters.hourlyRate, $gte: minRate };
                if (!isNaN(maxRate)) filters.hourlyRate = { ...filters.hourlyRate, $lte: maxRate };
            }

            const freelancers = await FreelancerProfileUseCase.getFreelancers({filters, sortCriteria, skip, limit});
            const totalFreelancers = await FreelancerProfileUseCase.getFreelancersCount(filters);
            const totalPages = Math.ceil(totalFreelancers/limit);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: FreelancerProfileMessages.FETCH_SUCCESS,
                data: freelancers,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    },

    getFreelancerByUserId: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const freelancer = await FreelancerProfileUseCase.getFreelancerByUserId(id);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: FreelancerProfileMessages.FETCH_ONE_SUCCESS,
                freelancer
            });
        } catch (error) {
            next(error); 
        }
    },
    
    getFreelancerById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params; 
            const freelancer = await FreelancerProfileUseCase.getFreelancerById(id);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: FreelancerProfileMessages.FETCH_ONE_SUCCESS,
                freelancer
            });
        } catch (error) {
            next(error); 
        }
    }
}