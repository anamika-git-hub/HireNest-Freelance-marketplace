import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id?: string;
    email: string;
    password?: string;
    role: "client" | "freelancer" | "admin";
    isBlocked?: boolean;
    isVerified?: boolean;
}

interface UserState {
    users: User[];
    currentUser?: User | null;
    clients: User[];
    freelancers: User[];
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    clients: [],
    freelancers: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        loginUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
            
        },
        logoutUser: (state) => {
            state.currentUser = null;
            localStorage.removeItem("currentUser");
        },
        logoutAdmin: (state) => {
            state.currentUser = null;
            localStorage.removeItem("adminRole");
          },
        setUsersByType: (
            state,
            action: PayloadAction<{ userType: "client" | "freelancer"; users: User[] }>
        ) => {
            const { userType, users } = action.payload;
            if (userType === "client") {
                state.clients = users;
            } else if (userType === "freelancer") {
                state.freelancers = users;
            }
        },
    },
});

export const { registerUser, loginUser, logoutUser, setUsersByType, logoutAdmin } = userSlice.actions;
export default userSlice.reducer;
