import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController} from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { isFreelancer } from '../middlewares/auth';


const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile", uploadFreelancerImages,isFreelancer, FreelancerProfileController.updateProfile);

router.get("/tasks-list",isFreelancer,TaskController.getTasks);


router.post("/create-bid",isFreelancer,  BidController.createBid);
router.put("/update-bid/:id", isFreelancer, BidController.updateBid);
router.delete("/delete-bid/:id",isFreelancer, BidController.deleteBid);

export default router;