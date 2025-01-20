import express from 'express';

import { UserController } from '../controllers/UserController';
import { AccountDetailController } from '../controllers/accountDetailController';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { BookMarkController } from '../controllers/bookmarkController';
import { MessageController } from '../controllers/messageController';
import { uploadProfileImages } from '../middlewares/uploadFileImages';
import { BidController } from '../controllers/bidController';
import { CategoryController } from '../controllers/categoryController';
import { FreelancerProfileController } from '../controllers/freelancerProfileController';
import { isUser } from '../middlewares/auth';

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

router.get('/categories',isUser,CategoryController.getAllCategories);

router.post('/setup-account', uploadProfileImages, AccountDetailController.setUpAccount);
router.put ('/update-account',uploadProfileImages,isUser, AccountDetailController.updateAccount);
router.get('/account-detail',isUser,AccountDetailController.getAccountDetail);
router.post('/update-role',isUser,UserController.updateRole);

router.get("/bid/:id",isUser, BidController.getBidById);

router.get("/freelancer-profile/:id",isUser,FreelancerProfileController.getFreelancerByUserId);

router.post('/bookmarks',isUser,BookMarkController.createBookmarks); 
router.get('/bookmarks',isUser,BookMarkController.getBookmarks);

router.get('/task-bookmarks',isUser,BookMarkController.getBookmarks);
router.delete('/bookmarks/:id',isUser,BookMarkController.deleteBookmarks);

router.get('/get-receivers',isUser,MessageController.getReceiver);
router.post('/set-contacts',isUser,MessageController.setContacts);

router.get('/notifications/:type',isUser,UserController.getNotification);


export default router;