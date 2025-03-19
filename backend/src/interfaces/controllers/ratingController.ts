
import { FreelancerReviewUseCase } from "../../application/freelancerReviewUseCase";
import { FilterCriteria } from "../../entities/filter";
import { Next, Req, Res } from "../../infrastructure/types/serverPackageTypes";
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { RatingMessages } from "../constants/responseMessages";

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

  export const RatingController = {
    reviewFreelancer: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const { freelancerId, taskId, contractId, rating, review } = req.body;
            const clientId = req.user?.userId || '';
            
            const result = await FreelancerReviewUseCase.reviewFreelancer(
                contractId, 
                taskId,
                clientId, 
                freelancerId, 
                rating,
                review || ''
            );
            
            const statusCode = result.isNewReview ? HttpStatusCode.CREATED : HttpStatusCode.OK;
            const message = result.isNewReview ? RatingMessages.REVIEW_CREATE_SUCCESS : RatingMessages.REVIEW_UPDATE_SUCCESS;
            
            sendResponse(res, statusCode, {
                message: message,
                review: result.review
            });
        } catch (error) {
            next(error);
        }
    },
    
    getFreelancerReviews: async (req: Req, res: Res, next: Next) => {
        try {
            const userId = req.params.id;
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const searchTerm = req.query.searchTerm as string || '';
            const skip = (page - 1) * limit;
            const filters: FilterCriteria = {};

            if (searchTerm && searchTerm.trim()) {
                filters.$or = [
                    { projectName: { $regex: searchTerm, $options: 'i' } },
                    { review: { $regex: searchTerm, $options: "i" } }
                ];
            }

            const reviews = await FreelancerReviewUseCase.getFreelancerReviews(userId, filters, skip, limit);
            const totalReviews = await FreelancerReviewUseCase.getReviewsCount(filters);
            const totalPages = Math.ceil(totalReviews / limit);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RatingMessages.REVIEWS_FETCH_SUCCESS,
                reviews,
                totalPages
            });
        } catch (error) {
            console.error('Error retrieving freelancer reviews:', error);
            next(error);
        }
    },

    getFreelancerRatings: async (req: Req, res: Res, next: Next) => {
        try {
            const ratings = await FreelancerReviewUseCase.getAggregatedRatings();
            
            sendResponse(res, HttpStatusCode.OK, {
                message: RatingMessages.RATINGS_FETCH_SUCCESS,
                ratings
            });
        } catch (error) {
            next(error);
        }
    }
}