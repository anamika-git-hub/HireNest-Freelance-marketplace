import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { CategoryUseCase } from '../../application/categoryUseCase';
import { FilterCriteria } from '../../entities/filter';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { CategoryMessages } from '../constants/responseMessages';

export const CategoryController = {
    createCategory: async (req: Req, res: Res, next: Next) => {
      try {
        const data = req.body;
        const file = req.file; 
    
        const result = await CategoryUseCase.createCategory(data, file);
        sendResponse(res, HttpStatusCode.CREATED, {
          message: CategoryMessages.CREATE_SUCCESS,
          category: result
        });
      } catch (error) {
        next(error);
      }
    },
    
    getAllCategories: async (req: Req, res: Res, next: Next) => {
      try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const searchTerm = req.query.searchTerm as string || "";
  
        const skip = (page - 1) * limit;
        const filters: FilterCriteria = {};
        
        if(searchTerm && searchTerm.trim()) {
          filters.name = {$regex: searchTerm, $options: "i"};
        }
        
        const categories = await CategoryUseCase.getAllCategories({filters, skip, limit});
        const totalCategories = await CategoryUseCase.getCategoryCount(filters);
        const totalPages = Math.ceil(totalCategories/limit);
        
        sendResponse(res, HttpStatusCode.OK, {
          message: CategoryMessages.FETCH_SUCCESS,
          categories,
          totalPages
        });
      } catch (error) {
        next(error);
      }
    },
    
    getCategoryById: async (req: Req, res: Res, next: Next) => {
      try {
        const {id} = req.params;
        const category = await CategoryUseCase.getCategoryById(id);
      
        sendResponse(res, HttpStatusCode.OK, {
          message: CategoryMessages.FETCH_ONE_SUCCESS,
          category
        });
      } catch (error) {
        next(error);
      }
    },
    
    updateCategory: async (req: Req, res: Res, next: Next) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const file = req.file;
  
        const updateCategory = await CategoryUseCase.updateCategory(id, updates, file);
        sendResponse(res, HttpStatusCode.OK, {
          message: CategoryMessages.UPDATE_SUCCESS,
          updateCategory
        });
      } catch (error) {
        next(error);
      }
    },
    
    deleteCategory: async(req: Req, res: Res, next: Next) => {
      try {
        const {id} = req.params;
        const result = await CategoryUseCase.deleteCategory(id);
        sendResponse(res, HttpStatusCode.OK, {
          message: CategoryMessages.DELETE_SUCCESS,
          result
        });
      } catch (error) {
        next(error);
      }
    }
  };