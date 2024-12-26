import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController } from '../controllers/bidController';
import { uploadTaskFiles } from '../middlewares/uploadFileImages';  
import checkTokenBlacklist from '../middlewares/TokenBlocklist';

const router = express.Router();

router.use(checkTokenBlacklist);

router.post("/create-task", uploadTaskFiles, TaskController.createTask);
router.put("/update-task/:id", uploadTaskFiles, TaskController.updateTask);
router.delete("/delete-task/:id", TaskController.deleteTask);
router.get('/my-tasks',TaskController.getTasksByUserId);

router.get('/freelancer-list',FreelancerProfileController.getFreelancers);
router.get('/freelancer/:id',FreelancerProfileController.getFreelancerById);

export default router;
