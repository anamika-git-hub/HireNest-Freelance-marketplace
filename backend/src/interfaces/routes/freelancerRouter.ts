import express from 'express';

import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { TaskController } from '../controllers/taskController';
import { uploadFreelancerImages } from '../middlewares/uploadFileImages';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post("/setup-freelancer-profile", uploadFreelancerImages, FreelancerProfileController.createProfile);
router.put("/update-freelancer-profile/:id", uploadFreelancerImages, FreelancerProfileController.updateProfile);

router.get("/tasks-list",TaskController.getTasks);
router.get('/tasks/:id', TaskController.getTaskById);
export default router;