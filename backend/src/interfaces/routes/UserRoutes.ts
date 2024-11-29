import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

router.post ('/signup',UserController.signUp);
router.post ('/verify-otp',UserController.verifyOtp);
router.post ('/resend-otp', UserController.resendOtp);
router.post('/login', UserController.login);

export default router;