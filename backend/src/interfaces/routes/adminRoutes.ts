import express from 'express';
import { AdminController } from '../controllers/adminController';
import { CategoryController } from '../controllers/categoryController';
import { uploadCategoryImage } from '../middlewares/uploadFileImages';
import { isAdmin } from '../middlewares/auth';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/freelancers', isAdmin,AdminController.getFreelancers);
router.get('/clients',isAdmin, AdminController.getClients);

router.post('/categories',isAdmin,uploadCategoryImage,CategoryController.createCategory);
router.get('/categories/:id',isAdmin,CategoryController.getCategoryById);
router.put('/categories/:id',isAdmin,uploadCategoryImage,CategoryController.updateCategory);
router.delete('/categories/:id',isAdmin,CategoryController.deleteCategory);


router.put('/:userId/:isBlocked',isAdmin,AdminController.toggleBlockUser);
export default router;