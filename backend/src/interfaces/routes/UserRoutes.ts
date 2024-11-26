import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

router.post ('/signup',UserController.signUp);
router.post('/login', UserController.login);

export default router;