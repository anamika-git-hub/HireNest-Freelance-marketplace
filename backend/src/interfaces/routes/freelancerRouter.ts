import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController} from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { RequestController } from '../controllers/requestController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { checkAuth } from '../middlewares/auth';
import { ContractController } from '../controllers/ContractController';


const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile", uploadFreelancerImages,checkAuth('freelancer'), FreelancerProfileController.updateProfile);

router.get("/tasks-list",checkAuth('freelancer'),TaskController.getTasks);
router.get("/freelancer-request",checkAuth('freelancer'),RequestController.getRequestByFreelancerId)

router.post("/create-bid",checkAuth('freelancer'),  BidController.createBid);
router.put("/update-bid/:id", checkAuth('freelancer'), BidController.updateBid);
router.delete("/delete-bid/:id",checkAuth('freelancer'), BidController.deleteBid);

router.patch("/request-status/:id", checkAuth('freelancer'),RequestController.requestStatusUpdate);

router.patch("/contract-status/:id",checkAuth('freelancer'),ContractController.updateContractStatus);

export default router;