import express from 'express';
import { AdminController } from '../controllers/adminController';
import { CategoryController } from '../controllers/categoryController';
import { uploadCategoryImage } from '../middlewares/uploadFileImages';
import { checkAuth } from '../middlewares/auth';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/freelancers', checkAuth('admin'),AdminController.getFreelancers);
router.get('/clients',checkAuth('admin'), AdminController.getClients);

router.post('/categories',checkAuth('admin'),uploadCategoryImage,CategoryController.createCategory);
router.get('/categories/:id',checkAuth('admin'),CategoryController.getCategoryById);
router.put('/categories/:id',checkAuth('admin'),uploadCategoryImage,CategoryController.updateCategory);
router.delete('/categories/:id',checkAuth('admin'),CategoryController.deleteCategory);


router.put('/:userId/:isBlocked',checkAuth('admin'),AdminController.toggleBlockUser);
export default router;