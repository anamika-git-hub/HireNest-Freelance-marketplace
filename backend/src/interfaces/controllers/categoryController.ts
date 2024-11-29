import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { CategoryUseCase } from '../../application/categoryUseCase';

export const CategoryController = {
    createCategory: async (req: Req, res: Res, next: Next) => {
        try {
            const result = await CategoryUseCase.createCategory(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    getAllCategories: async (req: Req, res: Res, next: Next) => {
        try {
            const categories = await CategoryUseCase.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },
    getCategoryById: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const category = await CategoryUseCase.getCategoryById(id);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    },
    updateCategory: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const updates = req.body;
            const updateCategory = await CategoryUseCase.updateCategory(id, updates);
            res.status(200).json(updateCategory);
        }catch(error){
            next(error)
        }
    },
    deleteCategory: async(req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const result = await CategoryUseCase.deleteCategory(id);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
    
}