import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  email: null,
  uid: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUid: (state, action) => {
      state.uid = action.payload;
    },
  },
});

export const { setEmail, setUid } = authSlice.actions;
export default authSlice.reducer;
