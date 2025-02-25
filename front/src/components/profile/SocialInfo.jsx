import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { getCookie } from '../../utils/cookie';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { follow } from '../../utils/profileApi';
import { followOthers, setFollow } from '../../stores/profile';

const SocialInfo = ({ idx }) => {
  const dispatch = useDispatch();
  const { selectedData, userId } = useSelector((state) => state.profile);

  const onClickFollow = async () => {
    const res = await follow(selectedData[idx].id);
    if (res.isFollowing && userId == getCookie('userId')) {
      dispatch(setFollow(res));
    } else {
      dispatch(
        followOthers({
          isFollowing: res.isFollowing,
          id: selectedData[idx].id,
          isMine: userId == getCookie('userId'),
        }),
      );
    }
  };

  return (
    <div className="w-full rounded-sm bg-white flex justify-between items-center p-2 h-[2.75rem]">
      <div className="flex gap-2 items-center h-full">
        <div className="h-full aspect-square rounded-full overflow-hidden">
          <LazyImg
            src={
              selectedData[idx].profile_image
                ? selectedData[idx].profile_image
                : unknown
            }
            className="w-full h-full"
          />
        </div>
        <span className="text-black text-sm">{selectedData[idx].username}</span>
      </div>
      {selectedData[idx].id != getCookie('userId') && (
        <Button
          $background={
            selectedData[idx].isFollowing ? Colors.btnLightGray : Colors.btnBlue
          }
          $marginLeft={0}
          $marginTop={0}
          $fontSize={0.75}
          onClick={onClickFollow}
        >
          {selectedData[idx].isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      )}
    </div>
  );
};

export default SocialInfo;
