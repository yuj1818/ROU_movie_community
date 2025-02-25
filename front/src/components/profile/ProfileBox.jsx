import { useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { getCookie } from '../../utils/cookie';
import SocialList from './SocialList';

const ProfileBox = () => {
  const {
    userId,
    username,
    profile_image,
    followers,
    followings,
    like_genres,
    hate_genres,
    rate_image,
  } = useSelector((state) => state.profile);

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
        <Button $background={Colors.btnBlue} $width={5} $marginLeft={0}>
          팔로우
        </Button>
      )}
      <SocialList />
    </div>
  );
};

export default ProfileBox;
