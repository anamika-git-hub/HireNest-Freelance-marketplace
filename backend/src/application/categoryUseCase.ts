import { Icategory } from "../entities/Category";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepository";
import cloudinaryV2 from "../utils/cloudinary";

export const CategoryUseCase = {
    createCategory: async (category: Icategory, file: Express.Multer.File | undefined) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    folder: "categories",
                });
                return result.secure_url;
            };
    
            // Handle category image upload (single file)
            const categoryImageUrl = file
                ? await uploadToCloudinary(file.path) // File is now a single file, not an array
                : null;
    
            const categoryData = {
                ...category,
                image: categoryImageUrl,
            };
    
            return await CategoryRepository.createCategory(categoryData);
        } catch (error: any) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    },
    getAllCategories: async () => {
        return await CategoryRepository.getAllCategories();
    },

    getCategoryById: async (id: string) => {
        return await CategoryRepository.getCategoryById(id);
    },

    updateCategory: async (
        id: string,
        updates: Partial<Icategory>,
        file: Express.Multer.File | undefined
    ) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    folder: "categories",
                });
                return result.secure_url;
            };
    
            // If a new image file is uploaded, upload it to Cloudinary and update the category image URL
            let categoryImageUrl = null;
            if (file) {
                categoryImageUrl = await uploadToCloudinary(file.path);
            }
    
            // Include the category image URL only if it's a new file or if the image needs to be updated
            const updatedCategoryData = {
                ...updates,
                image: categoryImageUrl || updates.image, // Retain the existing image if no new file is uploaded
            };
    
            return await CategoryRepository.updateCategory(id, updatedCategoryData);
        } catch (error: any) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    },
  

    deleteCategory: async (id: string) => {
        return await CategoryRepository.deleteCategory(id);
    },
};
