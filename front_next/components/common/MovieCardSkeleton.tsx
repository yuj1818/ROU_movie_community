import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function MovieCardSkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={cn('w-full aspect-3/4 cursor-pointer', className)}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}
