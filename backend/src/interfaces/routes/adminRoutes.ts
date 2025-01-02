import express from 'express';
import { AdminController } from '../controllers/adminController';
import { CategoryController } from '../controllers/categoryController';
import { uploadCategoryImage } from '../middlewares/uploadFileImages';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/freelancers', AdminController.getFreelancers);
router.get('/clients', AdminController.getClients);

router.post('/categories',uploadCategoryImage,CategoryController.createCategory);
router.get('/categories',CategoryController.getAllCategories);
router.get('/categories/:id',CategoryController.getCategoryById);
router.put('/categories/:id',uploadCategoryImage,CategoryController.updateCategory);
router.delete('/categories/:id',CategoryController.deleteCategory);


router.put('/:userId/:isBlocked', AdminController.toggleBlockUser);
export default router;