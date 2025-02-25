import { useDispatch, useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { getCookie } from '../../utils/cookie';
import SocialList from './SocialList';
import { follow } from '../../utils/profileApi';
import { useParams } from 'react-router-dom';
import { setFollow } from '../../stores/profile';

const ProfileBox = () => {
  const { userId, username, profile_image, isFollowing } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();

  const onClickFollow = async () => {
    const res = await follow(userId);
    dispatch(setFollow(res));
  };

  return (
    <div className="w-[28%] flex flex-col gap-2 items-center">
      <div className="w-1/2 rounded-full overflow-hidden">
        <LazyImg
          className="w-full h-full"
          src={
            profile_image
              ? import.meta.env.VITE_API_URL + profile_image
              : unknown
          }
          alt="profile_img"
        />
      </div>
      <p className="font-pretendard_semibold text-2xl">{username}</p>
      {userId != getCookie('userId') && (
        <Button
          $background={isFollowing ? Colors.btnLightGray : Colors.btnBlue}
          $width={6}
          $marginLeft={0}
          onClick={onClickFollow}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      )}
      <SocialList />
    </div>
  );
};

export default ProfileBox;
