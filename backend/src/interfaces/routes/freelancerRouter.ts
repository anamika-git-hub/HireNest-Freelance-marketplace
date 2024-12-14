import express from 'express';

import { FreelancerController } from '../controllers/freelancerController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerController.createProfile);
router.put("/update-freelancer-profile/:id", uploadFreelancerImages, FreelancerController.updateProfile);

export default router;