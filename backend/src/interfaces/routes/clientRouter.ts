import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController } from '../controllers/bidController';
import { uploadTaskFiles } from '../middlewares/uploadFileImages';  
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { isUser } from '../middlewares/auth';

const router = express.Router();

router.use(checkTokenBlacklist);

router.post("/create-task", uploadTaskFiles,isUser, TaskController.createTask);
router.put("/update-task/:id", uploadTaskFiles,isUser, TaskController.updateTask);
router.delete("/delete-task/:id",isUser, TaskController.deleteTask);
router.get('/my-tasks',isUser,TaskController.getTasksByUserId);

router.get('/freelancer-list',isUser,FreelancerProfileController.getFreelancers);
router.get('/freelancer/:id',isUser,FreelancerProfileController.getFreelancerById);

export default router;
