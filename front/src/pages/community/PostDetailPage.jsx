import { useParams } from 'react-router-dom';
import PostDetailInfo from '../../components/community/PostDetailInfo';
import { useEffect } from 'react';
import { getPostDetail } from '../../utils/communityApi';
import { useDispatch } from 'react-redux';
import { setPostInfo } from '../../stores/community';

const PostDetailPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const getPostDetailData = async () => {
    const res = await getPostDetail(params.review_id);
    dispatch(setPostInfo(res));
  };

  useEffect(() => {
    getPostDetailData();
  }, [params.review_id]);

  return (
    <div className="w-full flex flex-col justify-center items-center py-8 my-auto h-fit">
      <PostDetailInfo />
    </div>
  );
};

export default PostDetailPage;
