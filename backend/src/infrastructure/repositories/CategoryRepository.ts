import { CategoryModel } from "../models/CategoryModel";
import { Icategory } from "../../entities/Category";
import { FilterCriteria } from "../../entities/filter";

export const CategoryRepository = {
    createCategory: async (categoryData: Icategory) => new CategoryModel (categoryData).save(),
    getAllCategories: async (filters:FilterCriteria, skip:number, limit: number) =>{
    const categories = await CategoryModel.find({...filters}).skip(skip).limit(limit); 
    return categories.map((category) => ({
        ...category.toObject(),
        id: category._id.toString(),
    }) as Icategory);
    },
    getCategoryCount: async(filters:FilterCriteria) => {
        return await CategoryModel.countDocuments({...filters})
    },
    getCategoryById: async (id: string) =>{
        const category = await CategoryModel.findById(id);
        return category ? {...category.toObject(), id: category._id.toString()}: null;
    },
    updateCategory: async (id: string, updates: Icategory) => 
        CategoryModel.findByIdAndUpdate(id, updates, {new: true}),
    deleteCategory: async (id: string) => CategoryModel.findByIdAndDelete(id),
}