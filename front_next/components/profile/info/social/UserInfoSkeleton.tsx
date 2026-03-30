import { Skeleton } from '@/components/ui/skeleton';

export default function UserInfoSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col px-4 py-6 rounded-md bg-white/10 gap-4 items-center">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-15" />
    </div>
  );
}
