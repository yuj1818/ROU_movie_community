import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/community';

export const getPostInfo = async (reviewId: number | string) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${URL}/${reviewId}/`, {
    headers: {
      Authorization: session ? `Token ${session?.backendToken}` : '',
    },
  });

  if (!res.ok) throw new Error(`게시글_${reviewId} 조회 실패`);

  return res.json();
};

export const getPostList = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${URL}/`, {
    headers: {
      Authorization: session ? `Token ${session?.backendToken}` : '',
    },
  });

  if (!res.ok) throw new Error('게시글 목록 조회 실패');

  return res.json();
};
