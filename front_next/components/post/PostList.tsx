'use client';

import { getPostList } from '@/lib/client/post';
import { usePostStore } from '@/stores/usePostStore';
import { PaginatedResponse } from '@/types/common';
import { Post } from '@/types/post';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import PostInfo from './PostInfo';
import PostItem from './PostItem';

export default function PostList() {
  const { page, sort } = usePostStore(
    useShallow((state) => ({
      page: state.page,
      sort: state.sort,
    })),
  );

  const { data, isPending } = useQuery<PaginatedResponse<Post>>({
    queryKey: ['posts', page, sort],
    queryFn: () => getPostList(page, sort),
    placeholderData: (prev) => prev,
  });

  const posts = data?.results ?? [];

  return (
    <div className="w-full flex flex-col gap-4">
      {posts.map((post: Post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
}
