import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/accounts';

export const getProfileInfo = async (userId: number | string) => {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error('사용자 인증 실패');

  const res = await fetch(`${URL}/profile/${userId}/`, {
    headers: {
      Authorization: `Token ${session?.backendToken}`,
    },
  });

  if (!res.ok) throw new Error(`사용자_${userId} 조회 실패`);

  return res.json();
};
