import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
    id?: string;
    name: string;
    description: string;
    image: string;
    state?:'active'| 'inactive'
}

interface CategoryState {
    categories: Category[];
}

const initialState: CategoryState = {
    categories: [],
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },
        getCategories:(state, action: PayloadAction<Category[]> )=>{
            state.categories = action.payload;
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
            const index = state.categories.findIndex(
              (category) => category.id === action.payload.id
            );
            if (index !== -1) {
              state.categories[index] = action.payload;
            }
          },
          deleteCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter(
              (category) => category.id !== action.payload
            );
          },
        
    }
});

export const {addCategory, getCategories, updateCategory, deleteCategory} = categorySlice.actions;
export default categorySlice.reducer;