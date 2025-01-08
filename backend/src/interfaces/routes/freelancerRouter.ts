import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController} from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { isUser } from '../middlewares/auth';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile", uploadFreelancerImages,isUser, FreelancerProfileController.updateProfile);
router.get("/freelancer-profile/:id",isUser,FreelancerProfileController.getFreelancerByUserId);


router.get("/tasks-list",isUser,TaskController.getTasks);
router.get('/tasks/:id',isUser, TaskController.getTaskById);


router.post("/create-bid",isUser,  BidController.createBid);
router.put("/update-bid/:id", isUser, BidController.updateBid);
router.delete("/delete-bid/:id",isUser, BidController.deleteBid);
router.get("/task-bids/:taskId",isUser, BidController.getBidsByTask);
router.get("/bid/:id",isUser, BidController.getBidById);
export default router;