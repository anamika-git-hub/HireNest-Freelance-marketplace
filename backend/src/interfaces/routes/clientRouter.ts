import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController } from '../controllers/bidController';
import { RequestController } from '../controllers/requestController';
import { uploadTaskFiles } from '../middlewares/uploadFileImages';  
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { checkAuth } from '../middlewares/auth';
import { ContractController } from '../controllers/ContractController';

const router = express.Router();

router.use(checkTokenBlacklist);

router.post("/create-task", uploadTaskFiles,checkAuth('client'), TaskController.createTask);
router.put("/update-task/:id", uploadTaskFiles,checkAuth('client'), TaskController.updateTask);
router.delete("/delete-task/:id",checkAuth('client'), TaskController.deleteTask);
router.get('/my-tasks',checkAuth('client'),TaskController.getTasksByUserId);

router.get('/freelancer-list',checkAuth('client'),FreelancerProfileController.getFreelancers);
router.get('/freelancer/:id',checkAuth('client'),FreelancerProfileController.getFreelancerById);


router.get("/task-bids/:taskId",checkAuth('client'), BidController.getBidsByTask);
router.post("/create-request",checkAuth('client'),  RequestController.createRequest);
router.put("/update-request/:id", checkAuth('client'), RequestController.updateRequest);
router.delete("/delete-request/:id",checkAuth('client'), RequestController.deleteRequest);
router.get("/client-request",checkAuth('client'),RequestController.getRequestByUserId)
router.get("/request/:id",checkAuth('client'), RequestController.getRequestById);

router.post("/create-contract",checkAuth('client'),ContractController.createContract);
router.patch("/bid-status/:id",checkAuth('client'),BidController.BidStatusUpdate);
router.put("/update-contract/:id",checkAuth('client'),ContractController.updateContract)
export default router;
