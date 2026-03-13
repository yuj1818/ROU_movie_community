import { Comment } from '@/types/post';
import dayjs from '@/lib/dayjs';
import { CircleX, CornerDownRight, Heart, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CommentInfo({
  content,
  comment_writor,
  commented,
  created_at,
  isLike,
  like_count,
  depth = 0,
}: Comment & { depth?: number }) {
  const session = useSession();
  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-sm">
              {comment_writor.nickname}
            </span>
            <span className="text-xs text-muted-foreground">
              {dayjs(created_at).fromNow()}
            </span>
          </div>
          <div className="flex gap-1 text-muted-foreground">
            {comment_writor.id === session.data?.user.id && (
              <>
                <Trash2 className="cursor-pointer size-4" />
                {isEdit ? (
                  <CircleX
                    className="cursor-pointer size-4"
                    onClick={() => setIsEdit(false)}
                  />
                ) : (
                  <Pencil
                    className="cursor-pointer size-4"
                    onClick={() => setIsEdit(true)}
                  />
                )}
              </>
            )}
            {session.status === 'authenticated' && (
              <span
                className="text-xs underline underline-offset-2 cursor-pointer"
                onClick={() => setIsReply((prev) => !prev)}
              >
                {isReply ? '닫기' : '답변'}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="flex-1 text-sm whitespace-pre-line">{content}</span>
          <div className="flex gap-1 items-center">
            <Heart
              className={cn(
                'cursor-pointer size-4',
                isLike ? 'fill-primary' : '',
              )}
            />
            <span className="text-xs text-muted-foreground">{like_count}</span>
          </div>
        </div>
      </div>
      {commented.map((recomment) => (
        <div
          key={recomment.id}
          className={cn('flex gap-2')}
          style={{ marginLeft: `${4 * depth}px` }}
        >
          <CornerDownRight className="size-4" />
          <CommentInfo depth={depth + 1} {...recomment} />
        </div>
      ))}
    </div>
  );
}
