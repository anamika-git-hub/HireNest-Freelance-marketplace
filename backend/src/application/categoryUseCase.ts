import { Icategory } from "../entities/Category";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepository";

export const CategoryUseCase = {
    createCategory: async (category: Icategory) => {
        const newCategory = await CategoryRepository.createCategory(category);
        return newCategory;
    },
    getAllCategories: async () => {
        return await CategoryRepository.getAllCategories();
    },
    getCategoryById: async (id: string) => {
        return await CategoryRepository.getCategoryById(id);
    },
    updateCategory: async (id: string, updates: Icategory) => {
        return await CategoryRepository.updateCategory(id, updates);
    },
    deleteCategory: async (id: string) => {
        return await CategoryRepository.deleteCategory(id);
    }
}