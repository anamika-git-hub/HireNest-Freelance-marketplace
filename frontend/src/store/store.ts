import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import categoryReducer from './categorySlice';


const store = configureStore({
    reducer: {
        user: userReducer, 
        category: categoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
