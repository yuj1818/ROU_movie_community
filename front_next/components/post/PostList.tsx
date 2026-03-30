'use client';

import { getPostList } from '@/lib/client/post';
import { usePostStore } from '@/stores/usePostStore';
import { PaginatedResponse } from '@/types/common';
import { Post } from '@/types/post';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import PostItem from './PostItem';
import { Skeleton } from '../ui/skeleton';
import PaginationWrapper from '../common/PaginationWrapper';
import { NotebookPen } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function PostList() {
  const { page, sort, prevPage, nextPage, setPage } = usePostStore(
    useShallow((state) => ({
      page: state.page,
      sort: state.sort,
      prevPage: state.prevPage,
      nextPage: state.nextPage,
      setPage: state.setPage,
    })),
  );

  const { data, isPending } = useQuery<PaginatedResponse<Post>>({
    queryKey: ['posts', page, sort],
    queryFn: () => getPostList(page, sort),
    placeholderData: (prev) => prev,
  });

  const posts = data?.results ?? [];

  if (posts.length === 0) {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center gap-2">
        <NotebookPen className="size-1/4 min-w-10 text-muted-foreground stroke-1.5" />
        <span className="text-muted-foreground">게시글이 없습니다</span>
        <Button variant="outline">
          <Link href="/post/create">새글 작성</Link>
        </Button>
      </div>
    );
  }

  if (isPending)
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton className="w-full h-20" />
        ))}
      </div>
    );

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-4">
      {posts.map((post: Post) => (
        <PostItem key={post.id} {...post} />
      ))}
      {data && data.count > 0 && (
        <PaginationWrapper
          currentPage={page}
          totalPages={Math.ceil(data?.count / 10)}
          prev={prevPage}
          next={nextPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
