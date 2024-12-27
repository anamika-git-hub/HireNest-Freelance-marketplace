import express from 'express';

import { UserController } from '../controllers/UserController';
import { AccountDetailController } from '../controllers/accountDetailController';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { uploadProfileImages } from '../middlewares/uploadFileImages';
import { isUser } from '../middlewares/auth';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post ('/signup',UserController.signUp);
router.post ('/google-signup',UserController.googleSignUp)
router.post ('/verify-otp',UserController.verifyOtp);
router.post ('/resend-otp', UserController.resendOtp);
router.post('/login', UserController.login);

router.post('/setup-account', uploadProfileImages, AccountDetailController.setUpAccount);
router.put ('/update-account',uploadProfileImages,isUser, AccountDetailController.updateAccount);
router.get('/account-detail/:id',AccountDetailController.getAccountDetail);
router.post('/update-role',UserController.updateRole);


export default router;