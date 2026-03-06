'use client';

import { getPostInfo } from '@/lib/client/post';
import { PostDetail } from '@/types/post';
import { useQuery } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';
import Image from 'next/image';
import { MEDIA_BASE_URL } from '@/constants/url';
import ReactionToggle from './ReactionToggle';

export default function PostInfo({ initialData }: { initialData: PostDetail }) {
  const router = useRouter();
  const { status } = useSession();
  const { data: post, isPending } = useQuery<PostDetail>({
    queryKey: ['post', initialData.id],
    queryFn: async () => {
      const res = await getPostInfo(initialData.id.toString());
      return res;
    },
    initialData,
  });

  return (
    <div className="w-full flex flex-col justify-center gap-4 rounded p-6 border border-white">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{post.title}</h2>
          <div className="flex gap-2 text-sm">
            {status === 'authenticated' ? (
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() => router.push(`/profile/${post.review_writor.id}`)}
              >
                by. {post.review_writor.nickname}
              </span>
            ) : (
              `by. ${post.review_writor.nickname}`
            )}
            <span>{dayjs(post.created_at).format('YYYY-MM-DD')}</span>
            <span className="text-muted-foreground">
              {dayjs(post.created_at).fromNow()}
            </span>
          </div>
        </div>
        <X className="cursor-pointer size-7" />
      </div>
      <ReactionToggle />
      <div className="w-full flex">
        {post.review_movie && (
          <div className="w-1/4 min-w-36 min-h-48 pr-4">
            <div className="w-full aspect-3/4 relative">
              <Image
                className="rounded overflow-hidden"
                src={
                  MEDIA_BASE_URL.tmdbImgPath + post.review_movie.poster_path ||
                  ''
                }
                alt={`${post.review_movie.title}_poster`}
                fill
                sizes="300px"
                loading="eager"
              />
            </div>
          </div>
        )}
        <div className="w-3/4 whitespace-pre-line">{post.content}</div>
      </div>
    </div>
  );
}
