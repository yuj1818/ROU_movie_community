import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { useNavigate } from 'react-router-dom';
import { follow } from '../../utils/profileApi';
import { useDispatch } from 'react-redux';
import { followRecommendedFriend } from '../../stores/community';

const FriendBox = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickFollow = async (e) => {
    e.stopPropagation();
    await follow(data.id);
    dispatch(followRecommendedFriend(data.id));
  };

  return (
    <div
      className="w-full rounded-sm bg-white flex justify-between items-center p-2 h-[2.75rem]"
      onClick={() => navigate(`/profile/${data.id}`)}
    >
      <div className="flex gap-2 items-center h-full">
        <div className="h-full aspect-square rounded-full overflow-hidden">
          <LazyImg
            src={data.profile_image ? data.profile_image : unknown}
            className="w-full h-full"
          />
        </div>
        <span className="text-black text-sm text-ellipsis whitespace-nowrap">
          {data.username}
        </span>
      </div>
      <Button
        $background={data.isFollowing ? Colors.btnLightGray : Colors.btnBlue}
        $marginLeft={0}
        $marginTop={0}
        $fontSize={0.75}
        onClick={onClickFollow}
      >
        {data.isFollowing ? '팔로잉' : '팔로우'}
      </Button>
    </div>
  );
};

export default FriendBox;
