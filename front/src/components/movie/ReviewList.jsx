import { useEffect, useState } from 'react';
import { getMovieReviewList } from '../../utils/movieApi';
import { useParams } from 'react-router-dom';
import ReviewInfo from './ReviewInfo';
import { SubTitle } from './SubTitle';

const ReviewList = () => {
  const [reviewData, setReviewData] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const params = useParams();

  useEffect(() => {
    const getReviewData = async () => {
      const res = await getMovieReviewList(params.movie_id);
      setReviewData(res);
    };

    getReviewData();
    console.log(reviewData);
  }, []);

  return (
    reviewData && (
      <div className="flex flex-col w-full gap-2">
        <SubTitle>사용자 리뷰</SubTitle>
        <div className="flex flex-col w-full p-6 bg-white gap-2 rounded-sm">
          {reviewData.movie_review?.length ? (
            <>
              {reviewData.movie_review.length > 2 && (
                <p
                  className="text-xs text-gray-400 self-end cursor-pointer"
                  onClick={() => setIsAll((pre) => !pre)}
                >
                  {isAll ? '접기' : '전체 보기'}
                </p>
              )}
              <div className="flex flex-col w-full gap-2">
                {(isAll
                  ? reviewData.movie_review
                  : reviewData.movie_review.slice(0, 3)
                ).map((data) => (
                  <ReviewInfo key={data.id} data={data} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">리뷰가 아직 없습니다</p>
          )}
        </div>
      </div>
    )
  );
};

export default ReviewList;
