import PostCreationForm from '../../components/common/post/PostCreationForm';

const ReviewCreatePage = () => {
  return (
    <div className="grow flex justify-center">
      <PostCreationForm isReview={true} isEdit={false} />
    </div>
  );
};

export default ReviewCreatePage;
