import express from 'express';

import { UserController } from '../controllers/UserController';
import { AccountDetailController } from '../controllers/accountDetailController';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { BookMarkController } from '../controllers/bookmarkController';
import { MessageController } from '../controllers/messageController';
import { uploadProfileImages } from '../middlewares/uploadFileImages';
import { BidController } from '../controllers/bidController';
import { TaskController } from '../controllers/taskController';
import { CategoryController } from '../controllers/categoryController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { checkAuth } from '../middlewares/auth';
import { ContractController } from '../controllers/ContractController';
import { uploader,compressionMiddleware } from '../../utils/uploader';
import { PaymentController } from '../controllers/PaymentController';
import { RatingController } from '../controllers/ratingController';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post ('/signup',UserController.signUp);
router.post ('/google-signup',UserController.googleSignUp)
router.post ('/verify-otp',UserController.verifyOtp);
router.post ('/resend-otp', UserController.resendOtp);
router.post('/login', UserController.login);
router.post('/validate-password/:id',UserController.validatePassword);
router.post('/forgot-password',UserController.forgotPassword);
router.post('/reset-password',UserController.resetPassword);

router.get('/categories',CategoryController.getAllCategories);
router.post('/setup-account',uploader,compressionMiddleware,AccountDetailController.setUpAccount);
router.put ('/update-account',uploader,compressionMiddleware,checkAuth('user'), AccountDetailController.updateAccount);
router.get('/account-detail',checkAuth('user'),AccountDetailController.getAccountDetail);
router.post('/update-role',checkAuth('user'),UserController.updateRole);

router.get("/bid/:id",checkAuth('user'), BidController.getBidById);
router.get('/tasks/:id',checkAuth('user'), TaskController.getTaskById);

router.get("/freelancer-profile/:id",checkAuth('user'),FreelancerProfileController.getFreelancerByUserId);

router.post('/bookmarks',checkAuth('user'),BookMarkController.createBookmarks); 
router.get('/bookmarks',checkAuth('user'),BookMarkController.getBookmarks);

router.get('/task-bookmarks',checkAuth('user'),BookMarkController.getBookmarks);
router.delete('/bookmarks/:id',checkAuth('user'),BookMarkController.deleteBookmarks);

router.get('/get-receivers',checkAuth('user'),MessageController.getReceiver);
router.post('/set-contacts',checkAuth('user'),MessageController.setContacts);

router.get('/notifications',checkAuth('user'),UserController.getNotification);
router.put('/mark-as-read/:id',checkAuth('user'),UserController.notificationRead)


router.get("/contract/:id",checkAuth('user'),ContractController.getContract);
router.get("/contracts",checkAuth('user'),ContractController.getAllContracts);

router.post('/release-escrow',checkAuth('user'),PaymentController.releaseEscrow);

router.get('/freelancer-ratings',checkAuth('user'),RatingController.getFreelancerRatings);
export default router;