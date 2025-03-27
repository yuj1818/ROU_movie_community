import { useEffect } from 'react';
import { getRecommendedUsers } from '../../utils/profileApi';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../../stores/community';
import FriendBox from './FriendBox';

const FriendList = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.community);

  useEffect(() => {
    const getFriendData = async () => {
      const res = await getRecommendedUsers();
      dispatch(setFriends(res));
    };

    getFriendData();
  }, []);

  return (
    <div className="flex-shrink-0 h-fit w-1/5 flex flex-col gap-2 border border-solid border-white rounded p-2 mt-[4.25rem]">
      <p className="font-pretendard_semibold text-white">친구 추천</p>
      <div className="flex flex-col gap-2 h-fit max-h-[9.25rem] w-full grow overflow-y-auto">
        {friends ? (
          friends.map((friend) => <FriendBox key={friend.id} data={friend} />)
        ) : (
          <p className="text-center my-4 text-sm">추천 친구가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
