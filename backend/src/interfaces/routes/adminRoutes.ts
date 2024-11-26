import express from 'express';
import { AdminController } from '../controllers/adminController';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/freelancers', AdminController.getFreelancers);
router.get('/clients', AdminController.getClients);

router.post('/categories',AdminController.createCategory);
router.get('/categories',AdminController.getAllCategories);
router.get('/categories/:id',AdminController.getCategoryById);
router.put('/categories/:id',AdminController.updateCategory);
router.delete('/categories/:id',AdminController.deleteCategory);


export default router;