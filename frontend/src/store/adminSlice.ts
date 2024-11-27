import { createSlice } from "@reduxjs/toolkit";

interface User {
    id?: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer' | 'admin';
    isBlocked?: boolean;
    isVerified?: boolean; 
}

interface AdminState {
    clients: User[];
}

const initialState: AdminState = {
    clients: [],
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        getAllClients: (state, action: { payload: User[] }) => {
            state.clients = action.payload.filter(user => user.role === "client");
        },
    },
});

export const { getAllClients } = adminSlice.actions;
export default adminSlice.reducer;
