import { Req, Res, Next } from '../../infrastructure/types/serverPackageTypes';
import { TaskUseCase } from '../../application/taskUseCase';

interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
export const TaskController = {
    
    createTask: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body; 
            console.log('Task Data:', data);

            const files = req.files as { [key: string]: Express.Multer.File[] };

            const result = await TaskUseCase.createTask(data, files);
            res.status(201).json({ message: 'Task created successfully', task: result });
        } catch (error) {
            console.log('Error:', error);
            next(error); 
        }
    },

    updateTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;
            const updates = req.body; 
            const files = req.files as { [key: string]: Express.Multer.File[] }; 

            const result = await TaskUseCase.updateTask(id, updates, files);
            res.status(200).json({ message: 'Task updated successfully', task: result });
        } catch (error) {
            next(error); 
        }
    },

    deleteTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params;

            await TaskUseCase.deleteTask(id);
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            next(error); 
        }
    },
    getTasks: async (req: Req, res: Res, next: Next) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const sortOption = req.query.sortOption as string || "Relevance";

            const skip = (page - 1) * limit;

            let sortCriteria: { [key: string]: 1 | -1 } = {};
            if (sortOption === "Price: Low to High") sortCriteria.minRate = 1;
            if (sortOption === "Price: High to Low") sortCriteria.maxRate = -1;
            if (sortOption === "Newest") sortCriteria.createdAt = -1;

            const tasks = await TaskUseCase.getTasks({sortCriteria,skip,limit});
            const totalTasks = await TaskUseCase.getTasksCount();
            const totalPages = Math.ceil(totalTasks/limit);
            res.status(200).json({data: tasks,totalPages, message: 'Tasks got successfully'})
        } catch (error) {
            next(error)
        }
    },

    getTaskById: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params; 
            const task = await TaskUseCase.getTaskById(id);
            res.status(200).json({ task, message: 'Task fetched successfully' });
        } catch (error) {
            next(error); 
        }
    },

    getTasksByUserId: async(req: CustomRequest, res: Res, next: Next) => {
        try {
            const userId = req.user?.userId || '';
            const task = await TaskUseCase.getTasksByUserId(userId);
            res.status(200).json(task);
        } catch (error) {
            next(error)
        }
    },

};
