import { Icategory } from "../entities/Category";
import { FilterCriteria } from "../entities/filter";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepository";
import { uploadToS3 } from "../utils/uploader";

export const CategoryUseCase = {
createCategory: async (category: Icategory, file: Express.Multer.File | undefined) => {
    try {
        const uploadImage = async (file: Express.Multer.File) => {
            try {
                const uniqueFileName = `${Date.now()}-${file.originalname}`;
                const result = await uploadToS3(
                    file.buffer,
                    `categoryImages/${uniqueFileName}`
                );
                return result.Location || `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/categoryImages/${uniqueFileName}`;
            } catch (error) {
                console.error(`Error uploading to S3:`, error);
                throw new Error(`Failed to upload file to S3`);
            }
        };

        const categoryImageUrl = file
            ? await uploadImage(file)
            : null;

        const categoryData = {
            ...category,
            image: categoryImageUrl,
        };

        return await CategoryRepository.createCategory(categoryData);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create category: ${error.message}`);
        } else {
            throw new Error(`Failed to create category due to an unknown error`);
        }
    }
},

updateCategory: async (
    id: string,
    updates: Partial<Icategory>,
    file: Express.Multer.File | undefined
) => {
    try {
        const uploadImage = async (file: Express.Multer.File) => {
            try {
                const uniqueFileName = `${Date.now()}-${file.originalname}`;
                const result = await uploadToS3(
                    file.buffer,
                    `categoryImages/${uniqueFileName}`
                );
                return result.Location || `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/categoryImages/${uniqueFileName}`;
            } catch (error) {
                console.error(`Error uploading to S3:`, error);
                throw new Error(`Failed to upload file to S3`);
            }
        };

        let categoryImageUrl = null;
        if (file) {
            categoryImageUrl = await uploadImage(file);
        }

        const updatedCategoryData = {
            ...updates,
            name: updates.name || '',
            image: categoryImageUrl || updates.image,
        };

        return await CategoryRepository.updateCategory(id, updatedCategoryData);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update category: ${error.message}`);
        } else {
            throw new Error(`Failed to update category due to an unknown error`);
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
    deleteCategory: async (id: string) => {
        return await CategoryRepository.deleteCategory(id);
    },
};
