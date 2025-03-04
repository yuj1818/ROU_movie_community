import PostCreationForm from '../../components/common/PostCreationForm';

const PostCreatePage = () => {
  return (
    <div className="grow flex justify-center">
      <PostCreationForm isReview={false} isEdit={false} />
    </div>
  );
};

export default PostCreatePage;
