import PostCreationForm from '../../components/common/post/PostCreationForm';

const PostCreatePage = () => {
  return (
    <div className="grow flex justify-center">
      <PostCreationForm isReview={false} isEdit={false} />
    </div>
  );
};

export default PostCreatePage;
