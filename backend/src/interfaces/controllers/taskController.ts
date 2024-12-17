import { Req, Res, Next } from '../../infrastructure/types/serverPackageTypes';
import { TaskUseCase } from '../../application/taskUseCase';

export const TaskController = {
    // Create a task submission
    createTask: async (req: Req, res: Res, next: Next) => {
        try {
            const data = req.body; // Task data (includes title, description, skills, etc.)
            console.log('Task Data:', data);

            // Files might be uploaded (attachments)
            const files = req.files as { [key: string]: Express.Multer.File[] };

            const result = await TaskUseCase.createTask(data, files);
            res.status(201).json({ message: 'Task created successfully', task: result });
        } catch (error) {
            console.log('Error:', error);
            next(error); // Pass error to the next middleware for error handling
        }
    },

    // Update an existing task submission
    updateTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params; // Task ID
            const updates = req.body; // Task updates (title, description, etc.)
            const files = req.files as { [key: string]: Express.Multer.File[] }; // File attachments (if any)

            const result = await TaskUseCase.updateTask(id, updates, files);
            res.status(200).json({ message: 'Task updated successfully', task: result });
        } catch (error) {
            next(error); // Pass error to the next middleware
        }
    },

    // Delete a task
    deleteTask: async (req: Req, res: Res, next: Next) => {
        try {
            const { id } = req.params; // Task ID to delete

            await TaskUseCase.deleteTask(id);
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            next(error); // Pass error to the next middleware
        }
    },
    getTasks: async (req: Req, res: Res, next: Next) => {
        try {
            const tasks = await TaskUseCase.getTasks();
            res.status(200).json({data: tasks, message: 'Tasks got successfully'})
        } catch (error) {
            
        }
    }

};
