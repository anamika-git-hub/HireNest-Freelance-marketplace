import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { FreelancerReviewRepository } from "../infrastructure/repositories/freelancerReviewRepository";


export const FreelancerReviewUseCase = {
    reviewFreelancer: async (
        contractId: string, 
        taskId: string,
        clientId: string, 
        freelancerId: string, 
        rating: number,
        review: string
    ) => {
        try {
            const contract = await ContractRepository.getContractByClientAndFreelancer(
                contractId,
                taskId,
                freelancerId,
                'accepted'
            );
            
            if (!contract) {
                throw new Error('Contract not found or not completed');
            }
            
            const existingReview = await FreelancerReviewRepository.findByContractId(contractId);
            
            let reviewDoc;
            let isNewReview = false;
            
            if (existingReview) {
                reviewDoc = await FreelancerReviewRepository.updateReview(
                    existingReview._id,
                    rating,
                    review
                );
            } else {
                isNewReview = true;
                reviewDoc = await FreelancerReviewRepository.createReview({
                    freelancerId,
                    clientId,
                    contractId,
                    rating,
                    review,
                    projectTitle: contract.title
                });
            }
            

            const allReviews = await FreelancerReviewRepository.findByFreelancerId(freelancerId);
            const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
            const averageRating = totalRating / allReviews.length;
            
            await FreelancerProfileRepository.updateFreelancerRating(
                freelancerId, 
                parseFloat(averageRating.toFixed(1)),
                allReviews.length
            );
            
            return {
                isNewReview,
                review: reviewDoc
            };
        } catch (error) {
            console.error('Error in reviewFreelancer use case:', error);
            throw error;
        }
    },
    
    getFreelancerReviews: async (freelancerId: string) => {
        try {
            const reviews = await FreelancerReviewRepository.findByFreelancerIdWithClient(freelancerId);
            return reviews;
        } catch (error) {
            console.error('Error in getFreelancerReviews use case:', error);
            throw error;
        }
    },
    getAggregatedRatings: async () => {
        try {
          return await FreelancerReviewRepository.getAggregatedRatings();
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to get freelancer ratings: ${error.message}`);
          } else {
            throw new Error(`Failed to get freelancer ratings due to an unknown error`);
          }
        }
      }
}