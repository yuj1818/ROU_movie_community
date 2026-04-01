import { authOptions } from '@/auth';
import { SortKey } from '@/constants/category';
import { getServerSession } from 'next-auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/movies';

export const searchMovie = async (query: string) => {
  const res = await fetch(`${URL}/search/?q=${query}`);

  if (!res.ok) throw new Error(`검색어_${query} 검색 실패`);

  return res.json();
};

export const getMovieInfo = async (movieId: number | string) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${URL}/${movieId}/`, {
    headers: {
      Authorization: session ? `Token ${session?.backendToken}` : '',
    },
  });

  if (!res.ok) throw new Error(`영화_${movieId} 조회 실패`);

  return res.json();
};

export const getTrendMovieList = async () => {
  const res = await fetch(`${URL}/trends/`);

  if (!res.ok) throw new Error('트렌드 영화 목록 조회 실패');

  return res.json();
};

export const getSortedMovieList = async (key: SortKey) => {
  const res = await fetch(`${URL}/sort?key=${key}`, { method: 'GET' });

  if (!res.ok) throw new Error(`${key} 정렬 영화 목록 조회 실패`);

  return res.json();
};
