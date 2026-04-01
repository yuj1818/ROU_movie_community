import { Skeleton } from '../ui/skeleton';

export default function ProfileBoxSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 items-center md:h-full md:min-h-0">
      <Skeleton className="size-32 rounded-full" />
      <div className="flex gap-2 items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-15" />
      </div>
      <Skeleton className="w-full h-14" />
      <Skeleton className="w-full h-40" />
    </div>
  );
}
