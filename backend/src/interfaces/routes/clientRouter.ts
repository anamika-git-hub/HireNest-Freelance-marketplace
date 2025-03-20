import express from 'express';

import { TaskController } from '../controllers/taskController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { BidController } from '../controllers/bidController';
import { RequestController } from '../controllers/requestController'; 
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { checkAuth } from '../middlewares/auth';
import { ContractController } from '../controllers/ContractController';
import { PaymentController } from '../controllers/PaymentController';
import { RatingController } from '../controllers/ratingController';
import { validateTaskSubmission } from '../middlewares/validators/taskValidator';
import { validateRequestSubmission } from '../middlewares/validators/requestValidator';
import { validateContract } from '../middlewares/validators/contractValidator';
import { validate } from '../middlewares/validationMiddleware';
import { validateRequestUpdate } from '../middlewares/validators/requestUpdateValidator';
import { validateTaskUpdate } from '../middlewares/validators/taskUpdateValidator';
import { compressionMiddleware, taskFileUploader } from '../../utils/uploader';

const router = express.Router();

router.use(checkTokenBlacklist);
router.post("/create-task",  taskFileUploader, compressionMiddleware,validateTaskSubmission, validate, checkAuth('client'), TaskController.createTask);
router.put("/update-task/:id", taskFileUploader, compressionMiddleware, validateTaskUpdate, validate, checkAuth('client'), TaskController.updateTask);
router.delete("/delete-task/:id",checkAuth('client'), TaskController.deleteTask);
router.get('/my-tasks',checkAuth('client'),TaskController.getTasksByUserId);

router.get('/freelancer-list',checkAuth('client'),FreelancerProfileController.getFreelancers);
router.get('/freelancer/:id',checkAuth('client'),FreelancerProfileController.getFreelancerById);


router.get("/task-bids/:taskId",checkAuth('client'), BidController.getBidsByTask);
router.get('/all-task-bids',checkAuth('client'),BidController.getAllBidsByTask);
router.post("/create-request",checkAuth('client'),validateRequestSubmission,validate, RequestController.createRequest);
router.put("/update-request/:id",checkAuth('client'),validateRequestUpdate,validate, RequestController.updateRequest);
router.delete("/delete-request/:id",checkAuth('client'), RequestController.deleteRequest);
router.get("/client-request",checkAuth('client'),RequestController.getRequestByUserId)
router.get("/request/:id",checkAuth('client'), RequestController.getRequestById);

router.post("/create-contract",validateContract,validate,checkAuth('client'),ContractController.createContract);
router.patch("/bid-status/:id",checkAuth('client'),BidController.BidStatusUpdate);
router.put("/update-contract/:id",validateContract,validate,checkAuth('client'),ContractController.updateContract);

router.post("/create-payment-intent",checkAuth('client'),PaymentController.createPaymentIntent);
router.post("/webhook", express.raw({type: 'application/json'}), PaymentController.createWebhook);

router.post('/accept-milestone', checkAuth('client'), ContractController.acceptMilestone);
router.post('/reject-milestone', checkAuth('client'), ContractController.rejectMilestone);
router.post('/release-escrow', checkAuth('client'), PaymentController.releaseEscrow);

router.post('/review-freelancer',checkAuth('client'),RatingController.reviewFreelancer);
router.post('/complete-contract',checkAuth('client'),ContractController.updateContractStatus);
router.get('/freelancer-reviews/:id',checkAuth('client'),RatingController.getFreelancerReviews);

export default router;
