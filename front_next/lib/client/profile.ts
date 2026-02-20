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
