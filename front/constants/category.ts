import { Tag } from '@/types/movie';

export const TAGS: Tag[] = [
  { id: 5, name: '드라마' },
  { id: 12, name: '액션' },
  { id: 6, name: '애니메이션' },
  { id: 7, name: '가족' },
  { id: 8, name: '코미디' },
  { id: 9, name: '로맨스' },
  { id: 2, name: '미스터리' },
  { id: 10, name: '범죄' },
  { id: 11, name: 'SF' },
  { id: 13, name: '모험' },
  { id: 14, name: '판타지' },
  { id: 3, name: '스릴러' },
  { id: 16, name: '음악' },
  { id: 19, name: 'TV 영화' },
  { id: 18, name: '역사' },
  { id: 17, name: '다큐멘터리' },
  { id: 1, name: '공포' },
  { id: 4, name: '전쟁' },
  { id: 15, name: '서부' },
];

export const SORTS: Tag[] = [
  { id: 20, name: '인기 많은 영화 TOP 30', key: 'popular' },
  { id: 21, name: '최신 개봉 영화 TOP 30', key: 'latest' },
  { id: 22, name: '개봉 예정 영화 TOP 30', key: 'upcoming' },
  { id: 23, name: '평점이 높은 영화 TOP 30', key: 'rate' },
];

export type SortKey = 'popular' | 'latest' | 'upcoming' | 'rate';
