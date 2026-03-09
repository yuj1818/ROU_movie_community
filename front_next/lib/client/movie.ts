import { SortKey } from '@/constants/category';

const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/movies';

interface MovieReviewData {
  title: string;
  content: string;
}

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

export const getGenreMovieList = async (genreId: number | string) => {
  const res = await fetch(`${URL}/genre/${genreId}`, { method: 'GET' });

  if (!res.ok) throw new Error(`장르_${genreId} 영화 목록 조회 실패`);

  return res.json();
};

export const getMovieInfo = async (movieId: number | string) => {
  const res = await fetch(`${URL}/${movieId}`, { method: 'GET' });

  if (!res.ok) throw new Error(`영화_${movieId} 조회 실패`);

  return res.json();
};

export const getMovieReviewList = async (movieId: number | string) => {
  const res = await fetch(`${URL}/${movieId}/review`, { method: 'GET' });

  if (!res.ok) throw new Error(`영화_${movieId} 리뷰 조회 실패`);

  return res.json();
};

export const getRecommendMovieList = async (title: string) => {
  const res = await fetch(`${URL}/recommend?title=${title}`, { method: 'GET' });

  if (!res.ok)
    throw new Error(`영화_${title}와 비슷한 영화 추천 목록 조회 실패`);

  return res.json();
};

export const toggleWatch = async (movieId: number | string) => {
  const res = await fetch(`${URL}/${movieId}/watch`, { method: 'POST' });

  if (!res.ok) throw new Error('시청 여부 토글 실패');

  return res;
};

export const toggleReaction = async (
  movieId: number | string,
  type: 'LIKE' | 'DISLIKE',
) => {
  const res = await fetch(`${URL}/${movieId}/reaction`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });

  if (!res.ok) throw new Error('좋아요/싫어요 토글 실패');

  return res.json();
};

export const toggleFavorite = async (movieId: number | string) => {
  const res = await fetch(`${URL}/${movieId}/favorite`, { method: 'POST' });

  if (!res.ok) throw new Error('찜 토글 실패');

  return res.json();
};

export const createMovieReview = async (
  movieId: number | string,
  data: MovieReviewData,
) => {
  const res = await fetch(`${URL}/${movieId}/review`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('리뷰 작성 실패');

  return res.json();
};
