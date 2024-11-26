import { CategoryModel } from "../models/CategoryModel";

export const CategoryRepository = {
    createCategory: async (categoryData: any) => new CategoryModel (categoryData).save(),
    getAllCategories: async () => CategoryModel.find(),
    getCategoryById: async (id: string) => CategoryModel.findById(id),
    updateCategory: async (id: string, updates: any) => 
        CategoryModel.findByIdAndUpdate(id, updates, {new: true}),
    deleteCategory: async (id: string) => CategoryModel.findByIdAndDelete(id),
}