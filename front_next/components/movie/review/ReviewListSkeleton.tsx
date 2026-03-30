import Title from '@/components/common/Title';
import PostItemSkeleton from '@/components/post/PostItemSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewListSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="w-full flex justify-between items-center">
        <Title>사용자 리뷰</Title>
        <Skeleton className="w-21 h-9 rounded" />
      </div>
      <div className="flex flex-col w-full p-6 gap-2 rounded-md border border-foreground">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
