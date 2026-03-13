import { ReactionType } from '@/types/movie';
import { SortKey } from '@/types/post';

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

export const deletePost = async (reviewId: number | string) => {
  const res = await fetch(`${URL}/${reviewId}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('리뷰 삭제 실패');

  if (res.status === 204) return null;

  return res.json();
};

export const getPostList = async (page: number, sort: SortKey) => {
  const res = await fetch(`${URL}?page=${page}&sort=${sort}`);

  if (!res.ok) throw new Error('게시글 목록 조회 실패');

  return res.json();
};

export const createPost = async (data: { title: string; content: string }) => {
  const res = await fetch(`${URL}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('게시글 작성 실패');

  return res.json();
};

export const getCommentList = async (reviewId: number | string, page = 1) => {
  const res = await fetch(`${URL}/comment/${reviewId}?page=${page}`);

  if (!res.ok) throw new Error('게시글 댓글 조회 실패');

  return res.json();
};

export const createComment = async (
  reviewId: number | string,
  data: { content: string },
  commentId?: number | string,
) => {
  const res = await fetch(
    `${URL}/comment/${reviewId}/${commentId ? commentId : ''}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error('댓글 작성 실패');

  return res.json();
};
