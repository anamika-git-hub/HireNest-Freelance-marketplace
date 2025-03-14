import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { ITaskSubmissionForm } from "../entities/Tasks";
import cloudinaryV2 from "../utils/cloudinary";
import { FilterCriteria } from "../entities/filter";

export const TaskUseCase = {
    createTask: async (data: ITaskSubmissionForm, files: { [key: string]: Express.Multer.File[] }) => {
        try {
            const uploadToCloudinary = async (file: Express.Multer.File) => {
                const result = await cloudinaryV2.uploader.upload(file.path, {
                    folder: "tasks"
                });
                return result.secure_url;
            };

            const attachments = await Promise.all(
                (files.attachments || []).map(async (file) => {
                    const uploadedFileUrl = await uploadToCloudinary(file);
                    return uploadedFileUrl; 
                })
            );

            const taskData = {
                ...data,
                attachments, 
            };

            return await TaskRepository.createTask(taskData);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create task : ${error.message}`);
            }else {
                throw new Error(`Failed to create task due to an unknown error`);
            } 
        }
    },

    updateTask: async (
        id: string,
        updates: Partial<ITaskSubmissionForm>,
        files: { [key: string]: Express.Multer.File[] }
    ) => {
        try {
            const uploadToCloudinary = async (file: Express.Multer.File) => {
                const result = await cloudinaryV2.uploader.upload(file.path, {
                    folder: "tasks"
                });
                return result.secure_url;
            };
               let updatedAttachments = Array.isArray(updates.attachments) ? updates.attachments : 
                (typeof updates.attachments === 'string' ? [updates.attachments] : []);

            if (files.attachments) {
                const newAttachments = await Promise.all(
                    files.attachments.map(async (file) => {
                        const uploadedFileUrl = await uploadToCloudinary(file);
                        return uploadedFileUrl; 
                    })
                );
                updatedAttachments.push(...newAttachments);
            }

            const updatedTaskData = {
                ...updates,
                attachments: updatedAttachments,
            };

            return await TaskRepository.updateTask(id, updatedTaskData);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update Task: ${error.message}`);
            }else {
                throw new Error(`Failed to update Task due to an unknown error`);
            } 
        }
    },

    deleteTask: async (id: string) => {
        try {
            return await TaskRepository.deleteTask(id);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to delete Task: ${error.message}`);
            }else {
                throw new Error(`Failed to delete Task due to an unknown error`);
            } 
        }
    },

    getTasks: async ({filters,sortCriteria,skip,limit}:{
        filters:FilterCriteria;
        sortCriteria: { [key: string]: 1 | -1 };
        skip: number;
        limit: number;
}) => {
        try {
            return await TaskRepository.getTasks(filters,sortCriteria,skip,limit);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get Tasks: ${error.message}`);
            }else {
                throw new Error(`Failed to get Tasks due to an unknown error`);
            } 
        }
    },
    getTasksCount: async (filters:FilterCriteria) => {
        return await TaskRepository.getTaskCount(filters);
    },

    getTaskById: async (id: string) => {
        try {
            return await TaskRepository.getTaskById(id);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get Task by Id: ${error.message}`);
            }else {
                throw new Error(`Failed to Task by Id due to an unknown error`);
            } 
        }
    },
    getTasksByUserId: async (id:string) => {
        return await TaskRepository.getTaskByUserId(id)
    },

    
};
