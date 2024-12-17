import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { ITaskSubmissionForm } from "../entities/Tasks";
import cloudinaryV2 from "../utils/cloudinary";

export const TaskUseCase = {
    // Create a new task submission
    createTask: async (data: ITaskSubmissionForm, files: { [key: string]: Express.Multer.File[] }) => {
        try {
            const uploadToCloudinary = async (file: Express.Multer.File) => {
                const result = await cloudinaryV2.uploader.upload(file.path, {
                    folder: "tasks"
                });
                return result.secure_url;
            };

            // If there are attachments, process and upload them
            const attachments = await Promise.all(
                (files.attachments || []).map(async (file) => {
                    const uploadedFileUrl = await uploadToCloudinary(file);
                    return uploadedFileUrl; // Return only the URL of the uploaded file
                })
            );

            const taskData = {
                ...data,
                attachments, // Attach the array of file URLs (strings) to the task data
            };

            return await TaskRepository.createTask(taskData);
        } catch (error: any) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    },

    // Update an existing task submission
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

            let updatedAttachments = updates.attachments || [];

            // If there are new attachments, upload them and add to the existing ones
            if (files.attachments) {
                const newAttachments = await Promise.all(
                    files.attachments.map(async (file) => {
                        const uploadedFileUrl = await uploadToCloudinary(file);
                        return uploadedFileUrl; // Only store the file URL (as a string)
                    })
                );
                updatedAttachments.push(...newAttachments);
            }

            const updatedTaskData = {
                ...updates,
                attachments: updatedAttachments,
            };

            return await TaskRepository.updateTask(id, updatedTaskData);
        } catch (error: any) {
            throw new Error(`Failed to update task: ${error.message}`);
        }
    },

    // Delete a task submission
    deleteTask: async (id: string) => {
        try {
            return await TaskRepository.deleteTask(id);
        } catch (error: any) {
            throw new Error(`Failed to delete task: ${error.message}`);
        }
    },

    getTasks: async () => {
        try {
            return await TaskRepository.getTasks();
        } catch (error) {
            throw new Error ('Failed to get tasks')
        }
    }
    
};
