import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { RequestController } from '../controllers/requestController';
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


router.post("/create-request",isUser,  RequestController.createRequest);
router.put("/update-request/:id", isUser, RequestController.updateRequest);
router.delete("/delete-request/:id",isUser, RequestController.deleteRequest);
router.get("/client-request",isUser,RequestController.getRequestByUserId)
router.get("/request/:id",isUser, RequestController.getRequestById);
export default router;
