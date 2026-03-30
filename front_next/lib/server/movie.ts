import { authOptions } from '@/auth';
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
