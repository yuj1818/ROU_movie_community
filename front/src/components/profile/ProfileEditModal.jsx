import { useDispatch, useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import styled from 'styled-components';
import { Image } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { closeModal, openModal } from '../../stores/modal';
import { updateProfileData } from '../../utils/profileApi';
import { getCookie } from '../../utils/cookie';
import { setProfileInfo } from '../../stores/profile';
import unknown from '../../assets/profile.png';

const EditLayer = styled.label`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 0;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    opacity: 0.4;
  }
`;

const InputContainer = tw.div`
  flex w-3/4 gap-4 items-center text-sm
`;

const Input = tw.input`
  flex-grow h-[2rem] p-2 rounded-sm border border-gray-200 outline-gray-400
`;

const ProfileEditModal = () => {
  const { profile_image, region, birth } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [newImgFile, setNewImgFile] = useState(null);
  const [newImgUrl, setNewImgUrl] = useState(profile_image);
  const [newRegion, setNewRegion] = useState(region);
  const [newBirth, setNewBirth] = useState(birth);

  const onChangeImage = (e) => {
    const targetFile = e.target.files?.[0];
    setNewImgFile(targetFile);
    setNewImgUrl(URL.createObjectURL(targetFile));
  };

  const onSaveUpdatedInfo = async () => {
    const data = new FormData();
    if (newImgFile) data.append('profile_image', newImgFile);
    if (region) data.append('region', newRegion);
    if (birth) data.append('birth', newBirth);
    const res = await updateProfileData(getCookie('userId'), data);
    dispatch(setProfileInfo(res));
    dispatch(closeModal());
  };

  const onClickResign = () => {
    dispatch(openModal('resign'));
  };

  return (
    <div className="bg-white h-fit w-1/2 max-w-[28rem] p-8 rounded-sm flex flex-col justify-center items-center gap-4 relative z-1 shadow-md shadow-gray-500">
      <div className="w-1/3 aspect-square rounded-full relative overflow-hidden">
        <LazyImg
          src={newImgUrl ? newImgUrl : unknown}
          alt="profile_image"
          className="w-full h-full rounded-full"
        />
        <EditLayer htmlFor="file">
          <Image size="33%" color="white" />
        </EditLayer>
        <input
          id="file"
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onChangeImage}
        />
      </div>
      <InputContainer>
        <label htmlFor="region">지역</label>
        <Input
          id="region"
          type="text"
          value={newRegion}
          onChange={(e) => setNewRegion(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor="birth">생일</label>
        <Input
          id="birth"
          type="date"
          value={newBirth}
          onChange={(e) => setNewBirth(e.target.value)}
        />
      </InputContainer>
      <div className="flex gap-4 mt-2">
        <Button
          $background="white"
          $boxShadow={`0 0 0 1px ${Colors.btnGray} inset`}
          $color={Colors.btnGray}
          onClick={() => dispatch(closeModal())}
        >
          취소
        </Button>
        <Button $background={Colors.btnBlue} onClick={onSaveUpdatedInfo}>
          저장
        </Button>
      </div>
      <span
        className="text-xs font-pretendard_exlight text-red-500 underline underline-offset-2 cursor-pointer"
        onClick={onClickResign}
      >
        회원 탈퇴
      </span>
    </div>
  );
};

export default ProfileEditModal;
