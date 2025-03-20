import { Icategory } from "../entities/Category";
import { FilterCriteria } from "../entities/filter";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepository";
import cloudinaryV2 from "../utils/cloudinary";

export const CategoryUseCase = {
    createCategory: async (category: Icategory, file: Express.Multer.File | undefined) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    
                });
                return result.secure_url;
            };
    
            const categoryImageUrl = file
                ? await uploadToCloudinary(file.path) 
                : null;
    
            const categoryData = {
                ...category,
                image: categoryImageUrl,
            };
    
            return await CategoryRepository.createCategory(categoryData);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create category: ${error.message}`);
            }else {
                throw new Error(`Failed to create category due to an unknown error`);
            }
            
        }
    },
    getAllCategories: async ({filters,skip,limit}:{filters:FilterCriteria,skip:number, limit:number}) => {
        return await CategoryRepository.getAllCategories(filters,skip,limit);
    },
    getCategoryCount: async(filters:FilterCriteria)=> {
        return await CategoryRepository.getCategoryCount(filters)
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
                   
                });
                return result.secure_url;
            };
    
            let categoryImageUrl = null;
            if (file) {
                categoryImageUrl = await uploadToCloudinary(file.path);
            }
    
            const updatedCategoryData = {
                ...updates,
                name: updates.name || '',
                image: categoryImageUrl || updates.image, 
            };
    
            return await CategoryRepository.updateCategory(id, updatedCategoryData);
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update category: ${error.message}`);
            }else {
                throw new Error(`Failed to update category due to an unknown error`);
            }
            
        }
    },

    deleteCategory: async (id: string) => {
        return await CategoryRepository.deleteCategory(id);
    },
};
