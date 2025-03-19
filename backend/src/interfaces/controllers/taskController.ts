import { Req, Res, Next } from '../../infrastructure/types/serverPackageTypes';
import { TaskUseCase } from '../../application/taskUseCase';
import { FilterCriteria } from '../../entities/filter';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { TaskMessages } from '../constants/responseMessages';

interface CustomRequest extends Req {
  user?: { userId: string }; 
}

export const TaskController = {
  createTask: async (req: Req, res: Res, next: Next) => {
    try {
      const data = req.body; 
      const files = req.files as { [key: string]: Express.Multer.File[] };
      
      const result = await TaskUseCase.createTask(data, files);
      sendResponse(res, HttpStatusCode.CREATED, {
        message: TaskMessages.CREATE_SUCCESS,
        task: result
      });
    } catch (error) {
      next(error); 
    }
  },

  updateTask: async (req: Req, res: Res, next: Next) => {
    try {
      const { id } = req.params;
      const updates = req.body; 
      const files = req.files as { [key: string]: Express.Multer.File[] }; 

      const result = await TaskUseCase.updateTask(id, updates, files);
      sendResponse(res, HttpStatusCode.OK, {
        message: TaskMessages.UPDATE_SUCCESS,
        task: result
      });
    } catch (error) {
      next(error); 
    }
  },

  deleteTask: async (req: Req, res: Res, next: Next) => {
    try {
      const { id } = req.params;

      await TaskUseCase.deleteTask(id);
      sendResponse(res, HttpStatusCode.OK, {
        message: TaskMessages.DELETE_SUCCESS
      });
    } catch (error) {
      next(error); 
    }
  },

  getTasks: async (req: Req, res: Res, next: Next) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const sortOption = req.query.sortOption as string || "Relevance";
      const searchTerm = req.query.searchTerm as string || ""; 
      const bookmarkedTaskIds = req.query.bookmarkedTaskIds as string[] | undefined;
      const category = req.query.category as string | undefined;
      const skills = req.query.skills as string[] | undefined; 
      const priceRange = req.query.priceRange as { min: string; max: string } | undefined; 
      
      const skip = (page - 1) * limit;
  
      let sortCriteria: { [key: string]: 1 | -1 } = {};
      if (sortOption === "Price: Low to High") sortCriteria.minRate = 1;
      if (sortOption === "Price: High to Low") sortCriteria.maxRate = -1;
      if (sortOption === "Newest") sortCriteria.createdAt = -1;
  
      const filters: FilterCriteria = {};
      if (category) filters.category = category;
      if (skills) filters.skills = { $all: skills }; 
  
      if (priceRange) {
        const minRate = parseFloat(priceRange.min);
        const maxRate = parseFloat(priceRange.max);
        if (!isNaN(minRate)) filters.minRate = { $gte: minRate };
        if (!isNaN(maxRate)) filters.maxRate = { $lte: maxRate };
      }

      if (searchTerm && searchTerm.trim()) {
        filters.projectName = { $regex: searchTerm, $options: "i" } 
      }

      if (bookmarkedTaskIds) {
        filters._id = { $in: bookmarkedTaskIds };
      }

      const tasks = await TaskUseCase.getTasks({ filters, sortCriteria, skip, limit });
      const totalTasks = await TaskUseCase.getTasksCount(filters);
      const totalPages = Math.ceil(totalTasks / limit);
      
      sendResponse(res, HttpStatusCode.OK, {
        message: TaskMessages.FETCH_SUCCESS,
        data: tasks,
        totalPages
      });
    } catch (error) {
      next(error);
    }
  },

  getTaskById: async (req: Req, res: Res, next: Next) => {
    try {
      const { id } = req.params; 
      const task = await TaskUseCase.getTaskById(id);
      sendResponse(res, HttpStatusCode.OK, {
        message: TaskMessages.FETCH_ONE_SUCCESS,
        task
      });
    } catch (error) {
      next(error); 
    }
  },

  getTasksByUserId: async(req: CustomRequest, res: Res, next: Next) => {
    try {
      const userId = req.user?.userId || '';
      const task = await TaskUseCase.getTasksByUserId(userId);
      sendResponse(res, HttpStatusCode.OK, {
        message: TaskMessages.FETCH_USER_SUCCESS,
        task
      });
    } catch (error) {
      next(error)
    }
  },
};