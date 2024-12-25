import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id?: string | null;
    email: string;
    password?: string;
    role: "client" | "freelancer" | "admin";
    isBlocked?: boolean;
    isVerified?: boolean;
}

interface UserDetail {
    firstname: string;
    lastname: string;
    phone: string;
    dateOfBirth: string;
    idType: string;
    idNumber: string;
    profileImage: string;
    idFrontImage: string;
    idBackImage: string;
}

interface UserState {
    users: User[];
    currentUser?: User | null;
    currentUserDetail?: UserDetail | null;
    userId:string | null;
    clients: User[];
    freelancers: User[];
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    currentUserDetail: null,
    userId: null,
    clients: [],
    freelancers: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<{ user: User; id: string }>) => {
            state.users.push({ ...action.payload.user, id: action.payload.id });
            state.userId = action.payload.id;
        },        
        loginUser: (state, action: PayloadAction<{ user: User; userDetail: UserDetail }>
        ) => {
            state.currentUser = action.payload.user;
            state.currentUserDetail = action.payload.userDetail;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.currentUser = null;
            localStorage.removeItem("currentUser");
        },
        logoutAdmin: (state) => {
            state.currentUser = null;
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
