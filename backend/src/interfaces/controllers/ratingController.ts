
import { FreelancerReviewUseCase } from "../../application/freelancerReviewUseCase";
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
        } catch (error:any) {
            next(error);
        }
    },
    getFreelancerReviews: async (req: Req, res: Res, next: Next) => {
        try {
            const freelancerId = req.params.id;
            const reviews = await FreelancerReviewUseCase.getFreelancerReviews(freelancerId);
            
            res.status(200).json({
                message: 'Reviews retrieved successfully',
                reviews
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