import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  limit: null,
  quizIds: [],
  quizIdx: 0,
  quizStatus: 0,
  count: 0,
  curQuizStatus: 0,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setQuizIds(state, action) {
      state.quizIds = action.payload;
    },
    setQuizIdx(state, action) {
      state.quizIdx = action.payload;
    },
    setQuizStatus(state, action) {
      state.quizStatus = action.payload;
    },
  },
});

export const { setLimit, setQuizIds, setQuizIdx, setQuizStatus } =
  quizSlice.actions;
export default quizSlice.reducer;
