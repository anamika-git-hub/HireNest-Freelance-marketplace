import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController} from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile/:id", uploadFreelancerImages, FreelancerProfileController.updateProfile);
router.get("/my-profile/:id",FreelancerProfileController.getFreelancerByUserId);

router.get("/tasks-list",TaskController.getTasks);
router.get('/tasks/:id', TaskController.getTaskById);


router.post("/create-bid",  BidController.createBid);
router.put("/update-bid/:id",  BidController.updateBid);
router.delete("/delete-bid/:id", BidController.deleteBid);
router.get("/task-bids/:taskId", BidController.getBidsByTask);
router.get("/bid/:id", BidController.getBidById);
export default router;