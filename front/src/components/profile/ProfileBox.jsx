import { useDispatch, useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { getCookie } from '../../utils/cookie';
import SocialList from './SocialList';
import { follow } from '../../utils/profileApi';
import { setFollow } from '../../stores/profile';
import { Pencil } from 'lucide-react';
import { openModal } from '../../stores/modal';
import PreferenceList from './PreferenceList';

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
    <div className="w-[20%] max-h-full flex flex-col gap-2 items-center">
      <div className="h-[20%] max-h-[8rem] rounded-full aspect-square overflow-hidden">
        <LazyImg
          className="w-full h-full"
          src={profile_image ? profile_image : unknown}
          alt="profile_img"
        />
      </div>
      <div className="flex gap-2 items-center">
        <p className="font-pretendard_semibold text-2xl">{username}</p>
        {userId == getCookie('userId') && (
          <Pencil
            className="cursor-pointer"
            size="1rem"
            color="white"
            onClick={() => dispatch(openModal('profile'))}
          />
        )}
      </div>
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
      <PreferenceList />
    </div>
  );
};

export default ProfileBox;
