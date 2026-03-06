'use client';

import { getMovieReviewList } from '@/lib/client/movie';
import { Review } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ReviewItem from './ReviewItem';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Title from '@/components/common/Title';
import { useParams, useRouter } from 'next/navigation';

export default function ReviewList() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const { status } = useSession();
  const router = useRouter();
  const [isAll, setIsAll] = useState(false);
  const { data: reviews, isPending } = useQuery<Review[]>({
    queryKey: ['reviews', movieId],
    queryFn: async () => {
      const res = await getMovieReviewList(movieId);
      return res;
    },
  });

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="w-full flex justify-between items-center">
        <Title>사용자 리뷰</Title>
        {status === 'authenticated' && (
          <Button onClick={() => router.push(`/post/create/${movieId}`)}>
            리뷰 작성
          </Button>
        )}
      </div>
      <div className="flex flex-col w-full p-6 gap-2 rounded-md border border-foreground">
        {reviews && reviews.length > 0 ? (
          <>
            {reviews.length > 2 && (
              <span
                className="text-xs text-muted-foreground self-end cursor-pointer"
                onClick={() => setIsAll((prev) => !prev)}
              >
                {isAll ? '접기' : '전체 보기'}
              </span>
            )}
            <ul className="flex flex-col w-full gap-2">
              {(isAll ? reviews : reviews.slice(0, 3)).map((review) => (
                <ReviewItem key={review.id} {...review} />
              ))}
            </ul>
          </>
        ) : (
          <p className="text-muted-foreground text-center">
            리뷰가 아직 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
