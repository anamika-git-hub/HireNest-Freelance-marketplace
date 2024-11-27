import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id?: string;
    email: string;
    password: string;
    role: "client" | "freelancer" | "admin";
    isBlocked?: boolean;
    isVerified?: boolean;
}

interface UserState {
    users: User[];
    clients: User[];
    freelancers: User[];
}

const initialState: UserState = {
    users: [],
    clients: [],
    freelancers: [],
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        loginUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        getClients: (state) => {
            state.clients = state.users.filter(user => user.role === "client");
        },
        getFreelancers: (state) => {
            state.freelancers = state.users.filter(user => user.role === "freelancer");
        },
    },
});

export const { registerUser, loginUser, getClients, getFreelancers } = userSlice.actions;
export default userSlice.reducer;
