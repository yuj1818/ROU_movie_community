import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  limit: null,
  quizIds: [],
  quizIdx: 0,
  quizStatus: 0,
  count: 0,
  curQuizStatus: 0,
  curQuizRes: null,
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
    setCurQuizStatus(state, action) {
      state.curQuizStatus = action.payload;
    },
    setCurQuizRes(state, action) {
      state.curQuizRes = action.payload;
    },
    addCount(state) {
      state.count += 1;
    },
    restart(state) {
      state.limit = null;
      state.quizIds = [];
      state.quizIdx = 0;
      state.quizStatus = 0;
      state.count = 0;
      state.curQuizStatus = 0;
      state.curQuizRes = null;
    },
  },
});

export const {
  setLimit,
  setQuizIds,
  setQuizIdx,
  setQuizStatus,
  setCurQuizStatus,
  setCurQuizRes,
  addCount,
  restart,
} = quizSlice.actions;
export default quizSlice.reducer;
