import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController } from '../controllers/bidController';
import { RequestController } from '../controllers/requestController';
import { uploadTaskFiles } from '../middlewares/uploadFileImages';  
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { isClient } from '../middlewares/auth';

const router = express.Router();

router.use(checkTokenBlacklist);

router.post("/create-task", uploadTaskFiles,isClient, TaskController.createTask);
router.put("/update-task/:id", uploadTaskFiles,isClient, TaskController.updateTask);
router.delete("/delete-task/:id",isClient, TaskController.deleteTask);
router.get('/my-tasks',isClient,TaskController.getTasksByUserId);

router.get('/freelancer-list',isClient,FreelancerProfileController.getFreelancers);
router.get('/freelancer/:id',isClient,FreelancerProfileController.getFreelancerById);


router.get("/task-bids/:taskId",isClient, BidController.getBidsByTask);
router.post("/create-request",isClient,  RequestController.createRequest);
router.put("/update-request/:id", isClient, RequestController.updateRequest);
router.delete("/delete-request/:id",isClient, RequestController.deleteRequest);
router.get("/client-request",isClient,RequestController.getRequestByUserId)
router.get("/request/:id",isClient, RequestController.getRequestById);
export default router;
