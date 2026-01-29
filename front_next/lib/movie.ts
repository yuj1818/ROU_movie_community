const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/movies';

export const getTrendMovieList = async () => {
  const res = await fetch(`${URL}/trends`, { method: 'GET' });

  if (!res.ok) throw new Error('트렌드 영화 목록 조회 실패');

  return res.json();
};
