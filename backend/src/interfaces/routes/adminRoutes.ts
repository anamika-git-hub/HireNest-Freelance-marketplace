import express from 'express';
import { AdminController } from '../controllers/adminController';
import { CategoryController } from '../controllers/categoryController';
import { uploadCategoryImage } from '../middlewares/uploadFileImages';
import { checkAuth } from '../middlewares/auth';
import { validateCategoryCreation } from '../middlewares/validators/categoryValidation';
import { validate } from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/freelancers', checkAuth('admin'),AdminController.getFreelancers);
router.get('/clients',checkAuth('admin'), AdminController.getClients);

router.post('/categories',checkAuth('admin'),uploadCategoryImage,validateCategoryCreation,validate,CategoryController.createCategory);
router.get('/categories/:id',checkAuth('admin'),CategoryController.getCategoryById);
router.put('/categories/:id',checkAuth('admin'),uploadCategoryImage,validateCategoryCreation,validate,CategoryController.updateCategory);
router.delete('/categories/:id',checkAuth('admin'),CategoryController.deleteCategory);
router.get('/dashboard',checkAuth('admin'),AdminController.getDashboardStats);

router.put('/:userId/:isBlocked',checkAuth('admin'),AdminController.toggleBlockUser);
router.get('/transaction-history',checkAuth('admin'),AdminController.getTransactionHistory);

export default router;