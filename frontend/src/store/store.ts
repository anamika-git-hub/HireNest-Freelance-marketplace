import { configureStore } from "@reduxjs/toolkit";

import userReducer from './userSlice';
import categoryReducer from './categorySlice';
import accountReducer from './accountSlice';
import bookmarkReducer from './bookmarkSlice';

const store = configureStore({
    reducer: {
        user: userReducer, 
        category: categoryReducer,
        account: accountReducer,
        bookmarks:bookmarkReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
