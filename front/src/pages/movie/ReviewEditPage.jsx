import PostCreationForm from '../../components/common/PostCreationForm';

const ReviewEditPage = () => {
  return (
    <div className="grow flex justify-center">
      <PostCreationForm isReview={true} isEdit={true} />
    </div>
  );
};

export default ReviewEditPage;
