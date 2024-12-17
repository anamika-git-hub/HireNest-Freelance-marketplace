import express from 'express';

import { UserController } from '../controllers/UserController';
import { AccountDetailController } from '../controllers/accountDetailController';
import checkTokenBlacklist from '../middlewares/TokenBlocklist';
import { uploadProfileImages } from '../middlewares/uploadFileImages';

const router = express.Router();
router.use(checkTokenBlacklist);

router.post ('/signup',UserController.signUp);
router.post ('/google-signup',UserController.googleSignUp)
router.post ('/verify-otp',UserController.verifyOtp);
router.post ('/resend-otp', UserController.resendOtp);
router.post('/login', UserController.login);

router.post('/setup-account', uploadProfileImages, AccountDetailController.setupProfile);
router.put ('/update-account/:id',uploadProfileImages, AccountDetailController.updateProfile);
// router.get('/:userId/:role', ProfileController.getProfile);


export default router;