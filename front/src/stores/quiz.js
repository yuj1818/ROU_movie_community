import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  limit: null,
  quizData: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setQuizData(state, action) {
      state.quizData = action.payload;
    },
  },
});

export const { setLimit, setQuizDataa } = quizSlice.actions;
export default quizSlice.reducer;
