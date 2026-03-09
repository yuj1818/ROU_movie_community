import { ReactionType } from '@/types/movie';

const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/community';

export const getPostInfo = async (reviewId: number | string) => {
  const res = await fetch(`${URL}/${reviewId}`, { method: 'GET' });

  if (!res.ok) throw new Error(`게시글_${reviewId} 조회 실패`);

  return res.json();
};

export const toggleReaction = async (
  reviewId: number | string,
  type: ReactionType,
) => {
  const res = await fetch(`${URL}/${reviewId}/reaction`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });

  if (!res.ok) throw new Error('좋아요/싫어요 토글 실패');

  return res.json();
};

export const editPostInfo = async (
  reviewId: number | string,
  data: {
    title?: string;
    content?: string;
  },
) => {
  const res = await fetch(`${URL}/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('리뷰 수정 실패');

  return res.json();
};
