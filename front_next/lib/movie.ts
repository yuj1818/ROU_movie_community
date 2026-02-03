import { SortKey } from '@/constants/category';

const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/movies';

export const getTrendMovieList = async () => {
  const res = await fetch(`${URL}/trends`, { method: 'GET' });

  if (!res.ok) throw new Error('트렌드 영화 목록 조회 실패');

  return res.json();
};

export const getSortedMovieList = async (key: SortKey) => {
  const res = await fetch(`${URL}/sort?key=${key}`, { method: 'GET' });

  if (!res.ok) throw new Error(`${key} 정렬 영화 목록 조회 실패`);

  return res.json();
};

export const getGenreMovieList = async (genreId: number) => {
  const res = await fetch(`${URL}/genre/${genreId}`, { method: 'GET' });

  if (!res.ok) throw new Error(`장르_${genreId} 영화 목록 조회 실패`);

  return res.json();
};

export const searchMovie = async (query: string) => {
  const res = await fetch(`${URL}/search?q=${query}`, { method: 'GET' });

  if (!res.ok) throw new Error(`검색어_${query} 검색 실패`);

  return res.json();
};
