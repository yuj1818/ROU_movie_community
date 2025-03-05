import { useEffect, useState } from 'react';
import { getMovieReviewList } from '../../utils/movieApi';
import { useNavigate, useParams } from 'react-router-dom';
import PostInfo from '../common/post/PostInfo';
import { SubTitle } from './SubTitle';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { checkLogin } from '../../utils/authApi';

const ReviewList = () => {
  const [reviewData, setReviewData] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getReviewData = async () => {
      const res = await getMovieReviewList(params.movie_id);
      setReviewData(res);
    };

    getReviewData();
  }, [params.movie_id]);

  return (
    reviewData && (
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between items-center">
          <SubTitle>사용자 리뷰</SubTitle>
          {checkLogin() && (
            <Button
              $background={Colors.btnPurple}
              onClick={() => navigate(`/movie/review/${params.movie_id}`)}
            >
              리뷰 작성
            </Button>
          )}
        </div>
        <div className="flex flex-col w-full p-6 gap-2 rounded-md border border-solid border-white">
          {reviewData?.length ? (
            <>
              {reviewData.length > 2 && (
                <p
                  className="text-xs text-gray-400 self-end cursor-pointer"
                  onClick={() => setIsAll((pre) => !pre)}
                >
                  {isAll ? '접기' : '전체 보기'}
                </p>
              )}
              <div className="flex flex-col w-full gap-2">
                {(isAll ? reviewData : reviewData.slice(0, 3)).map((data) => (
                  <PostInfo key={data.id} data={data} />
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
