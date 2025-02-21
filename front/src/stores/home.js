import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTag: 0,
  isTagOpen: false,
  tags: [
    { id: 1, name: '액션' },
    { id: 2, name: '모험' },
    { id: 3, name: '애니메이션' },
    { id: 4, name: '코미디' },
    { id: 5, name: '범죄' },
    { id: 6, name: '다큐멘터리' },
    { id: 7, name: '드라마' },
    { id: 8, name: '가족' },
    { id: 9, name: '판타지' },
    { id: 10, name: '역사' },
    { id: 11, name: '공포' },
    { id: 12, name: '음악' },
    { id: 13, name: '미스터리' },
    { id: 14, name: '로맨스' },
    { id: 15, name: 'SF' },
    { id: 16, name: 'TV 영화' },
    { id: 17, name: '스릴러' },
    { id: 18, name: '전쟁' },
    { id: 19, name: '서부' },
  ],
  sortTitles: [
    { id: 20, name: '인기 많은 영화 TOP 30', key: 'popular' },
    { id: 21, name: '최신 개봉 영화 TOP 30', key: 'latest' },
    { id: 22, name: '개봉 예정 영화 TOP 30', key: 'upcoming' },
    { id: 23, name: '평점이 높은 영화 TOP 30', key: 'rate' },
  ],
  sortedMovies: {},
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    selectTag(state, action) {
      state.selectedTag = action.payload;
    },
    toggleTag(state) {
      state.isTagOpen = !state.isTagOpen;
    },
    setSortedMovies(state, action) {
      const { id, data } = action.payload;
      state.sortedMovies[id] = data;
    },
  },
});

export const { selectTag, toggleTag, setSortedMovies } = homeSlice.actions;
export default homeSlice.reducer;
