import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Freelancer {
    id: number;
    name: string;
    skill: string;
    hourlyRate: number;
}

interface FreelancerState {
    freelancers: Freelancer[];
}

const initialState: FreelancerState = {
    freelancers: [],
};

const freelancerSlice = createSlice({
    name: 'freelancers',
    initialState,
    reducers: {
        addFreelancer: (state, action: PayloadAction<Freelancer>) => {
            state.freelancers.push(action.payload);
        },
    },
});

export const { addFreelancer } = freelancerSlice.actions;
export default freelancerSlice.reducer;
