import express from 'express';
import { UserController } from '../controllers/UserController';
import { ProfileController } from '../controllers/profileController';

const router = express.Router();

router.post ('/signup',UserController.signUp);
router.post ('/verify-otp',UserController.verifyOtp);
router.post ('/resend-otp', UserController.resendOtp);
router.post('/login', UserController.login);

router.post('/setup', ProfileController.setupProfile);
router.put ('/update', ProfileController.updateProfile);
router.get('/:userId/:role', ProfileController.getProfile);


export default router;