const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/accounts';

export const getProfileInfo = async (userId: number | string) => {
  const res = await fetch(`${URL}/profile/${userId}`);

  if (!res.ok) throw new Error(`사용자_${userId} 조회 실패`);

  return res.json();
};

export const follow = async (userId: number | string) => {
  const res = await fetch(`${URL}/follow/${userId}`, { method: 'POST' });

  if (!res.ok) throw new Error(`사용자_${userId} 팔로우 실패`);

  return res.json();
};

export const updateProfileInfo = async (
  userId: number | string,
  data: FormData,
) => {
  const res = await fetch(`${URL}/profile/${userId}`, {
    method: 'PUT',
    body: data,
  });

  if (!res.ok) throw new Error(`사용자_${userId} 프로필 수정 실패`);

  return res.json();
};

export const updatePreference = async (
  pType: 'like' | 'hate',
  data: { genres: string },
) => {
  const res = await fetch(`${URL}/preference/${pType}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(`${pType === 'like' ? '선호' : '불호'}장르 수정 실패`);

  return res.json();
};

export const getRelations = async (
  userId: number | string,
  type: string,
  page: number,
) => {
  const res = await fetch(
    `${URL}/relations/${userId}?type=${type}&page=${page}`,
  );

  if (!res.ok) throw new Error(`사용자_${userId} ${type} 목록 조회 실패`);

  return res.json();
};

export const getMovieList = async (
  userId: number | string,
  target: string,
  page: number,
) => {
  const res = await fetch(
    `${URL}/movie/${userId}?target=${target}&page=${page}`,
  );

  if (!res.ok)
    throw new Error(`사용자_${userId} ${target} 영화 목록 조회 실패`);

  return res.json();
};

export const getRecommendedFriends = async (page: number) => {
  const res = await fetch(`${URL}/friend?page=${page}`);

  if (!res.ok) throw new Error(`추천 친구 목록 조회 실패`);

  return res.json();
};
