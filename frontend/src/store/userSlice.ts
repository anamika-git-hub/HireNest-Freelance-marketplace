import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id?: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer' | 'admin';
    isBlocked?: boolean;
    isVerified?: boolean; 
}

interface UserState {
    users: User[];
}

const initialState: UserState = {
    users: [],
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<User>) =>{
            state.users.push(action.payload);
        }
    }
});

export const { registerUser} = userSlice.actions;
export default userSlice.reducer;