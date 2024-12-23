// src/redux/slices/accountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  phone: '',
  dob: '',
  selectedID: 'debit_card',
  IDNumber: '',
  profileImage: null,
  idFrontImage: null,
  idBackImage: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountData: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.phone = action.payload.phone;
      state.dob = action.payload.dob;
      state.selectedID = action.payload.selectedID;
      state.IDNumber = action.payload.IDNumber;
      state.profileImage = action.payload.profileImage;
      state.idFrontImage = action.payload.idFrontImage;
      state.idBackImage = action.payload.idBackImage;
    },
  },
});

export const { setAccountData } = accountSlice.actions;
export default accountSlice.reducer;
