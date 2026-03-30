import { cn } from '@/lib/utils';
import { Post } from '@/types/post';
import { MessageSquareMore, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PostItem({
  id,
  review_writor,
  title,
  content,
  comment_count,
  like_count,
  dislike_count,
  reaction,
}: Post) {
  const router = useRouter();

  return (
    <li
      className="flex items-center gap-4 w-full h-20 px-6 py-4 border border-muted-foreground rounded-md cursor-pointer"
      onClick={() => router.push(`/post/${id}`)}
    >
      <Image
        className="w-12 h-12 rounded-full object-fit shrink-0 bg-white"
        src={
          review_writor.profile_image
            ? `/api/media/${review_writor.profile_image}`
            : '/profile.png'
        }
        alt={`${review_writor.nickname}_profile`}
        width={48}
        height={48}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <span className="text-base overflow-hidden text-ellipsis max-w-full">
          {title}
        </span>
        <div className="text-sm font-extralight overflow-hidden text-ellipsis max-w-full whitespace-pre-line line-clamp-1">
          {content}
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-2">
          <div className="flex h-4 items-center text-xs">
            <MessageSquareMore className="h-full" />
            <span>{comment_count}</span>
          </div>
          <div className="flex h-4 items-center text-xs">
            <ThumbsUp
              className={cn('h-full', reaction === 'LIKE' ? 'fill-white' : '')}
            />
            <span>{like_count}</span>
          </div>
          <div className="flex h-4 items-center text-xs">
            <ThumbsDown
              className={cn(
                'h-full',
                reaction === 'DISLIKE' ? 'fill-white' : '',
              )}
            />
            <span>{dislike_count}</span>
          </div>
        </div>
        <span className="underline underline-offset-2 cursor-pointer text-xs text-muted-foreground whitespace-nowrap text-right">
          {review_writor.nickname}
        </span>
      </div>
    </li>
  );
}
