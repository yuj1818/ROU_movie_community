import { useSelector } from 'react-redux';
import PostCreationForm from '../../components/common/PostCreationForm';

const PostEditPage = () => {
  const { postInfo } = useSelector((state) => state.community);

  return (
    postInfo && (
      <div className="grow flex justify-center">
        <PostCreationForm
          isReview={!(postInfo.review_movie === null)}
          isEdit={true}
        />
      </div>
    )
  );
};

export default PostEditPage;
