import PostInfo from '@/components/post/PostInfo';
import { getPostInfo } from '@/lib/server/post';

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId } = await params;

  const postInfo = await getPostInfo(reviewId);

  return (
    <div className="w-4/5 flex flex-col gap-4 py-12">
      <PostInfo initialData={postInfo} />
    </div>
  );
}
