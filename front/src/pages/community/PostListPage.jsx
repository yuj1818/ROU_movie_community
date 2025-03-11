import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import PostList from '../../components/community/PostList';
import Colors from '../../constants/Colors';
import { checkLogin } from '../../utils/authApi';
import FriendList from '../../components/community/FriendList';

const PostListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-4/5 text-white py-12 h-fit flex gap-6">
      <div className="flex flex-col gap-8 grow">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-pretendard_semibold">ROU 커뮤니티</h1>
          {checkLogin() && (
            <Button
              $marginTop={0}
              $background={Colors.btnPurple}
              onClick={() =>
                navigate('/review/create', {
                  state: { from: location.pathname },
                })
              }
            >
              새글 작성
            </Button>
          )}
        </div>
        <PostList />
      </div>
      <FriendList />
    </div>
  );
};

export default PostListPage;
