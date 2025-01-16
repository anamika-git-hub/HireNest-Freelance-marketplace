import { TaskSubmissionModel } from "../models/TaskSubmissionModel";
import { ITaskSubmissionForm } from "../../entities/Tasks";

export const TaskRepository = {
    // Create a new task submission
    createTask: async (data: ITaskSubmissionForm) => {
        try {
            const task = new TaskSubmissionModel(data);
            return await task.save();
        } catch (error: any) {
            throw new Error("Error creating task: " + error.message);
        }
    },

    // Update an existing task submission
    updateTask: async (id: string, updates: Partial<ITaskSubmissionForm>) => {
        try {
            const updatedTask = await TaskSubmissionModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedTask) {
                throw new Error("Task not found");
            }
            return updatedTask;
        } catch (error: any) {
            throw new Error("Error updating task: " + error.message);
        }
    },

    // Delete a task submission
    deleteTask: async (id: string) => {
        try {
            const deletedTask = await TaskSubmissionModel.findByIdAndDelete(id);
            if (!deletedTask) {
                throw new Error("Task not found");
            }
            return deletedTask;
        } catch (error: any) {
            throw new Error("Error deleting task: " + error.message);
        }
    },

    getTasks: async (filters:any,sortCriteria:{ [key: string]: 1 | -1 },skip:number,limit:number) => {
        const currentDate = new Date().toISOString(); 
        const result = await TaskSubmissionModel.find({
            ...filters,
            timeline: { $gt: currentDate }, 
        }).sort(sortCriteria).skip(skip).limit(limit);
        return result
     },
    getTaskCount: async(filters:any) => {
        try {
            const currentDate = new Date().toISOString(); 
            return await TaskSubmissionModel.countDocuments({
                ...filters,
                timeline: { $gt: currentDate }, 
            });
        } catch (error:any) {
            throw new Error(`Failed to count tasks: ${error.message}`);
        }
    } ,
    getTaskById: async (id: string) => {
        try {
            const task = await TaskSubmissionModel.findById(id);
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        } catch (error: any) {
            throw new Error("Error fetching task: " + error.message);
        }
    },

    getTaskByUserId: async (id:string) => {
        try {
            const task = await TaskSubmissionModel.find({clientId:id});
            if(!task) throw new Error("Task not found");
            return task;
        } catch (error: any) {
            throw new Error("Error fetching task:" + error.message)
        }
    }

};
