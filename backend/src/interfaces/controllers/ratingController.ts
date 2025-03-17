
import { FreelancerReviewUseCase } from "../../application/freelancerReviewUseCase";
import { FilterCriteria } from "../../entities/filter";
import { Next, Req, Res } from "../../infrastructure/types/serverPackageTypes";



interface CustomRequest extends Req {
    user?: { userId: string }; 
  }

export const RatingController = {
    reviewFreelancer: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const { freelancerId,taskId, contractId, rating, review } = req.body;
            const clientId = req.user?.userId || '';
            
            const result = await FreelancerReviewUseCase.reviewFreelancer(
                contractId, 
                taskId,
                clientId, 
                freelancerId, 
                rating,
                review || ''
            );
            
            res.status(result.isNewReview ? 201 : 200).json({
                review: result.review
            });
        } catch (error) {
            next(error);
        }
    },
    getFreelancerReviews: async (req: Req, res: Res, next: Next) => {
        try {
            const userId = req.params.id;
            const page = parseInt(req.query.page as string , 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const searchTerm = req.query.searchTerm as string || '';
            const skip = (page-1) * limit;
            const filters:FilterCriteria = {};

            if(searchTerm && searchTerm.trim()) {
                filters.$or = [
                    {projectName: { $regex: searchTerm,$options: 'i'}},
                    {review :{ $regex: searchTerm,$options: "i"}}
                ]
            }

            const reviews = await FreelancerReviewUseCase.getFreelancerReviews(userId,filters,skip,limit);
            const totalReviews = await FreelancerReviewUseCase.getReviewsCount(filters);
            const totalPages = Math.ceil(totalReviews/limit);
            res.status(200).json({
                message: 'Reviews retrieved successfully',
                reviews,
                totalPages
            });
        } catch (error) {
            console.error('Error retrieving freelancer reviews:', error);
            next(error);
        }
    },

    getFreelancerRatings: async(req: Req, res: Res, next: Next) => {
        try {
            const ratings = await FreelancerReviewUseCase.getAggregatedRatings();
            res.status(200).json({ratings,message: 'Freelancer ratings retrieved successfully'})
        } catch (error) {
            next(error)
        }
    }
}