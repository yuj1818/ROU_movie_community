'use client';

import { getMovieReviewList } from '@/lib/movie';
import { Review } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ReviewItem from './ReviewItem';

export default function ReviewList({ movieId }: { movieId: string }) {
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
        <h3 className="font-semibold text-xl text-white">사용자 리뷰</h3>
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
