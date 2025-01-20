import { CategoryModel } from "../models/CategoryModel";
import { Icategory } from "../../entities/Category";

export const CategoryRepository = {
    createCategory: async (categoryData: Icategory) => new CategoryModel (categoryData).save(),
    getAllCategories: async () =>{
       const categories =  CategoryModel.find();
        return (await categories).map((category)=>({
            ...category.toObject(),
            id : category._id.toString(),
        }) as Icategory)
    },
    getCategoryById: async (id: string) =>{
        const category = await CategoryModel.findById(id);
        return category ? {...category.toObject(), id: category._id.toString()}: null;
    },
    updateCategory: async (id: string, updates: Icategory) => 
        CategoryModel.findByIdAndUpdate(id, updates, {new: true}),
    deleteCategory: async (id: string) => CategoryModel.findByIdAndDelete(id),
}