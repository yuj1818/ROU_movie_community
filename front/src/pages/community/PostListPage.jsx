import PostList from '../../components/community/PostList';

const PostListPage = () => {
  return (
    <div className="w-4/5 flex flex-col gap-8 text-white py-12 h-fit">
      <h1 className="text-3xl font-pretendard_semibold">ROU 커뮤니티</h1>
      <PostList />
    </div>
  );
};

export default PostListPage;
