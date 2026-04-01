import { Comment } from '@/types/post';
import dayjs from '@/lib/dayjs';
import { CircleX, CornerDownRight, Heart, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import CommentTextarea from './CommentTextarea';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  createComment,
  deleteComment,
  editComment,
  likeComment,
} from '@/lib/client/post';
import { useModalContext } from '@/contexts/ModalContext';
import { PaginatedResponse } from '@/types/common';

export default function CommentInfo({
  id,
  content,
  comment_writor,
  commented,
  created_at,
  isLike,
  like_count,
  depth = 0,
}: Comment & { depth?: number }) {
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const session = useSession();
  const queryClient = useQueryClient();
  const { open, close } = useModalContext();
  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [replContent, setReplContent] = useState('');

  const toggleLikeOnComments = (
    comments: Comment[],
    updatedComment: { id: number; isLike: boolean; like_count: number },
  ): Comment[] => {
    return comments.map((c) => {
      if (c.id === updatedComment.id) {
        return {
          ...c,
          ...updatedComment,
        };
      } else if (c.commented.length > 0) {
        return {
          ...c,
          commented: toggleLikeOnComments(c.commented, updatedComment),
        };
      } else {
        return c;
      }
    });
  };

  const mutation = useMutation({
    mutationFn: ({
      content,
      commentId,
      type,
    }: {
      content?: string;
      commentId: number;
      type: 'reply' | 'edit' | 'delete' | 'like';
    }) => {
      if (type === 'reply') {
        return createComment(reviewId, { content: content || '' }, commentId);
      } else if (type === 'edit') {
        return editComment(reviewId, commentId, { content: content || '' });
      } else if (type === 'delete') {
        close();
        return deleteComment(reviewId, commentId);
      } else {
        return likeComment(reviewId, commentId);
      }
    },
    onSuccess: (updated, variables) => {
      const { type } = variables;

      if (type === 'like') {
        queryClient.setQueryData<{
          pages: PaginatedResponse<Comment>[];
          pageParams: (number | undefined)[];
        }>(['post', reviewId, 'comments'], (old) => {
          if (!old) return old;

          const newPages = old.pages.map((page) => ({
            ...page,
            results: toggleLikeOnComments(page.results, updated),
          }));

          return { ...old, pages: newPages };
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['post', reviewId, 'comments'],
        });
        if (isEdit) {
          setIsEdit(false);
        } else if (isReply) {
          setIsReply(false);
          setReplContent('');
        }
      }
    },
  });

  const onDelete = () => {
    open({
      title: '댓글을 삭제하시겠습니까?',
      rightBtnLabel: '삭제',
      buttonVariant: 'destructive',
      onRightBtnClick: () => mutation.mutate({ commentId: id, type: 'delete' }),
      leftBtnLabel: '취소',
      onLeftBtnClick: () => close(),
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 p-2">
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
                <Trash2 className="cursor-pointer size-4" onClick={onDelete} />
                {isEdit ? (
                  <CircleX
                    className="cursor-pointer size-4"
                    onClick={() => {
                      setEditedContent(content);
                      setIsEdit(false);
                    }}
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
        {isEdit ? (
          <div className="flex gap-2">
            <CommentTextarea
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <Button
              className="h-full"
              disabled={editedContent.trim() === ''}
              onClick={() =>
                mutation.mutate({
                  content: editedContent,
                  commentId: id,
                  type: 'edit',
                })
              }
            >
              댓글 수정
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="flex-1 whitespace-pre-line">{content}</span>
            <div className="flex gap-1 items-center">
              <Heart
                className={cn(
                  'cursor-pointer size-4',
                  isLike ? 'fill-primary' : '',
                )}
                onClick={() => mutation.mutate({ commentId: id, type: 'like' })}
              />
              <span className="text-xs text-muted-foreground">
                {like_count}
              </span>
            </div>
          </div>
        )}
      </div>
      {isReply && (
        <div className="flex gap-2">
          <CornerDownRight className="size-4" />
          <CommentTextarea
            rows={3}
            value={replContent}
            onChange={(e) => setReplContent(e.target.value)}
          />
          <Button
            className="h-full"
            disabled={replContent.trim() === ''}
            onClick={() =>
              mutation.mutate({
                content: replContent,
                commentId: id,
                type: 'reply',
              })
            }
          >
            답변 작성
          </Button>
        </div>
      )}
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
