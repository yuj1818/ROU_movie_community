import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import Colors from '../../constants/Colors';
import SocialInfo from './SocialInfo';

const Category = tw.div`
  flex gap-1 items-center text-sm text-white cursor-pointer
  ${(props) =>
    props.$isSelected ? 'font-pretendard_semibold' : 'font-pretendard_regular'}
`;

const CircleNum = tw.div`
  text-xs text-black rounded-full h-[1.2rem] w-[1.2rem] flex justify-center items-center font-pretendard_regular
  ${(props) => (props.$isSelected ? 'bg-white' : 'bg-gray-400')}
`;

const Num = styled.span`
  color: ${(props) => (props.$isSelected ? Colors.btnBlue : 'white')};
`;

const SocialList = () => {
  const { followers, followings, friends } = useSelector(
    (state) => state.profile,
  );
  const [selectedData, setSelectedData] = useState(null);
  const [category, setCategory] = useState('follower');

  useEffect(() => {
    if (category) {
      if (category === 'follower') {
        setSelectedData(followers);
      } else if (category === 'following') {
        setSelectedData(followings);
      } else {
        setSelectedData(friends);
      }
    }
  }, [category]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-around w-full">
        <Category
          $isSelected={category === 'follower'}
          onClick={() => setCategory('follower')}
        >
          <Num $isSelected={category === 'follower'}>Follower</Num>
          <CircleNum>{followers.length}</CircleNum>
        </Category>
        <Category
          $isSelected={category === 'following'}
          onClick={() => setCategory('following')}
        >
          <Num $isSelected={category === 'following'}>Following</Num>
          <CircleNum>{followings.length}</CircleNum>
        </Category>
        <Category
          $isSelected={category === 'friend'}
          onClick={() => setCategory('friend')}
        >
          <Num $isSelected={category === 'friend'}>Friend</Num>
          <CircleNum>{friends.length}</CircleNum>
        </Category>
      </div>
      <div className="flex flex-col w-full aspect-square rounded-md border border-solid border-white overflow-y-scroll">
        {selectedData &&
          selectedData.map((data) => <SocialInfo key={data.id} data={data} />)}
      </div>
    </div>
  );
};

export default SocialList;
