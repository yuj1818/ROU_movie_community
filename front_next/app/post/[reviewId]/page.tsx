import CommentList from '@/components/post/comment/CommentList';
import PostInfo from '@/components/post/PostInfo';
import { getPostInfo } from '@/lib/server/post';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', reviewId],
    queryFn: () => getPostInfo(reviewId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-4/5 flex flex-col gap-4 py-12">
        <PostInfo />
        <CommentList />
      </div>
    </HydrationBoundary>
  );
}
