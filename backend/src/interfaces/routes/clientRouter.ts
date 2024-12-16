import express from 'express';

import { ClientController } from '../controllers/clientController';
import { uploadTaskFiles } from '../middlewares/uploadFileImages';  
import checkTokenBlacklist from '../middlewares/TokenBlocklist';

const router = express.Router();

router.use(checkTokenBlacklist);

router.post("/create-task", uploadTaskFiles, ClientController.createTask);

router.put("/update-task/:id", uploadTaskFiles, ClientController.updateTask);

router.delete("/delete-task/:id", ClientController.deleteTask);

export default router;
