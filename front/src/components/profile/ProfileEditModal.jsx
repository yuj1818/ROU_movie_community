import { useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import styled from 'styled-components';
import { Image } from 'lucide-react';

const EditLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 0;
  cursor: pointer;

  &:hover {
    opacity: 0.4;
  }
`;

const ProfileEditModal = () => {
  const { profile_image, region, birth, userId } = useSelector(
    (state) => state.profile,
  );

  return (
    <div className="bg-white h-fit w-1/2 max-w-[28rem] p-8 rounded-sm flex flex-col justify-center items-center gap-4 relative z-1">
      <div className="w-1/3 aspect-square overflow-hidden rounded-full relative">
        <LazyImg
          src={profile_image}
          alt="profile_image"
          className="w-full h-full"
        />
        <EditLayer>
          <Image size="33%" color="white" />
        </EditLayer>
      </div>
    </div>
  );
};

export default ProfileEditModal;
