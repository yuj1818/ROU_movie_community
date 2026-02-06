import { Review } from '@/types/movie';
import { MessageSquareMore, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

export default function ReviewItem({
  review_writor,
  title,
  content,
  comment_count,
  like_count,
  dislike_count,
}: Review) {
  return (
    <li className="flex items-center gap-4 w-full h-20 px-6 py-4 bg-white rounded-md">
      <Image
        className="w-12 h-12 rounded-full object-fit shrink-0"
        src={
          review_writor.profile_path
            ? review_writor.profile_path
            : '/profile.png'
        }
        alt={`${review_writor.nickname}_profile`}
        width={12}
        height={12}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-2 text-black">
        <span className="text-base overflow-hidden text-ellipsis max-w-full">
          {title}
        </span>
        <div className="text-sm font-extralight overflow-hidden text-ellipsis max-w-full whitespace-pre-line line-clamp-1">
          {content}
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-2">
          <div className="flex h-4 items-center text-xs text-black">
            <MessageSquareMore className="h-full" />
            <span>{comment_count}</span>
          </div>
          <div className="flex h-4 items-center text-xs text-black">
            <ThumbsUp className="h-full" />
            <span>{like_count}</span>
          </div>
          <div className="flex h-4 items-center text-xs text-black">
            <ThumbsDown className="h-full" />
            <span>{dislike_count}</span>
          </div>
        </div>
        <span className="underline underline-offset-2 cursor-pointer text-xs font-extralight text-muted-foreground whitespace-nowrap text-right">
          {review_writor.nickname}
        </span>
      </div>
    </li>
  );
}
