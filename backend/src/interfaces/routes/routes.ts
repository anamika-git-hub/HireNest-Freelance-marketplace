import express  from "express";
import { signUpController } from "./UserController";

const router = express.Router();

router.post('/signup', signUpController);

export default router;