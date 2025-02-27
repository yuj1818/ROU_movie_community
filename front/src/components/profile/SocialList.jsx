import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import Colors from '../../constants/Colors';
import SocialInfo from './SocialInfo';
import { setCategory, setSelectedData } from '../../stores/profile';
import { useParams } from 'react-router-dom';

const Category = tw.div`
  flex gap-1 items-center text-sm text-white cursor-pointer font-pretendard_semibold
`;

const CircleNum = tw.div`
  text-xs text-black rounded-full h-[1.2rem] w-[1.2rem] flex justify-center items-center font-pretendard_regular
  ${(props) => (props.$isSelected ? 'bg-white' : 'bg-gray-400')}
`;

const Text = styled.span`
  color: ${(props) => (props.$isSelected ? Colors.btnBlue : 'white')};
  text-shadow: ${(props) =>
    props.$isSelected ? '0px 1px 2px rgba(255, 255, 255, 0.6)' : 'none'};
`;

const SocialList = () => {
  const { userId, followers, followings, friends, selectedData, category } =
    useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (category) {
      if (category === 'follower') {
        dispatch(setSelectedData(followers));
      } else if (category === 'following') {
        dispatch(setSelectedData(followings));
      } else {
        dispatch(setSelectedData(friends));
      }
    }
  }, [userId, category]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-around w-full">
        <Category onClick={() => dispatch(setCategory('follower'))}>
          <Text $isSelected={category === 'follower'}>팔로워</Text>
          <CircleNum $isSelected={category === 'follower'}>
            {followers.length}
          </CircleNum>
        </Category>
        <Category onClick={() => dispatch(setCategory('following'))}>
          <Text $isSelected={category === 'following'}>팔로잉</Text>
          <CircleNum $isSelected={category === 'following'}>
            {followings.length}
          </CircleNum>
        </Category>
        <Category onClick={() => dispatch(setCategory('friend'))}>
          <Text $isSelected={category === 'friend'}>친구</Text>
          <CircleNum $isSelected={category === 'friend'}>
            {friends.length}
          </CircleNum>
        </Category>
      </div>
      <div className="flex flex-col gap-1 p-2 w-full aspect-square max-h-[12.75rem] rounded-md border border-solid border-white overflow-y-auto">
        {selectedData &&
          selectedData.map((data, idx) => (
            <SocialInfo key={data.id} idx={idx} />
          ))}
      </div>
    </div>
  );
};

export default SocialList;
