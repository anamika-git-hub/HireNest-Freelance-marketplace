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
            const tasks = await TaskUseCase.getTasks();
            res.status(200).json({data: tasks, message: 'Tasks got successfully'})
        } catch (error) {
            
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
            console.log('fkjfdkfjsj',userId)
            const task = await TaskUseCase.getTasksByUserId(userId);
            res.status(200).json(task);
        } catch (error) {
            next(error)
        }
    },

};
