import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController} from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { RequestController } from '../controllers/requestController';
import { upload, uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { checkAuth } from '../middlewares/auth';
import { ContractController } from '../controllers/ContractController';
import { milestoneUploader } from '../../utils/uploader';
import { RatingController } from '../controllers/ratingController';
import { validate } from '../middlewares/validationMiddleware';
import { validateFreelancerProfile } from '../middlewares/validators/freelancerProfileValidator';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile",uploadFreelancerImages,validateFreelancerProfile,validate,FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile", uploadFreelancerImages,checkAuth('freelancer'),validateFreelancerProfile,validate,FreelancerProfileController.updateProfile);

router.get("/tasks-list",checkAuth('freelancer'),TaskController.getTasks);
router.get("/freelancer-request",checkAuth('freelancer'),RequestController.getRequestByFreelancerId)

router.post("/create-bid",checkAuth('freelancer'),  BidController.createBid);
router.put("/update-bid/:id", checkAuth('freelancer'), BidController.updateBid);
router.delete("/delete-bid/:id",checkAuth('freelancer'), BidController.deleteBid);

router.patch("/request-status/:id", checkAuth('freelancer'),RequestController.requestStatusUpdate);

router.patch("/contract-status/:id",checkAuth('freelancer'),ContractController.updateContractStatus);
router.post('/submit-milestone',checkAuth('freelancer'),milestoneUploader,ContractController.submitMilestone);
router.get('/reviews/:id',checkAuth('freelancer'),RatingController.getFreelancerReviews);

export default router;