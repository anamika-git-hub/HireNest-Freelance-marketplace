import { CategoryModel } from "../models/CategoryModel";


export const CategoryRepository = {
    createCategory: async (categoryData: any) => new CategoryModel (categoryData).save(),
    getAllCategories: async () =>{
       const categories =  CategoryModel.find();
        return (await categories).map((category: any)=>({
            ...category.toObject(),
            id : category._id.toString(),
        }))
    },
    getCategoryById: async (id: string) =>{
        const category = await CategoryModel.findById(id);
        return category ? {...category.toObject(), id: category._id.toString()}: null;
    },
    updateCategory: async (id: string, updates: any) => 
        CategoryModel.findByIdAndUpdate(id, updates, {new: true}),
    deleteCategory: async (id: string) => CategoryModel.findByIdAndDelete(id),
}