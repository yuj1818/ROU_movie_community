import { useSelector } from 'react-redux';
import LazyImg from '../common/LazyImg';
import styled from 'styled-components';
import { Image, CircleX } from 'lucide-react';
import { useRef, useState } from 'react';
import Colors from '../../constants/Colors';

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

const ProfileEditModal = () => {
  const { profile_image, region, birth, userId } = useSelector(
    (state) => state.profile,
  );
  const [isEdit, setIsEdit] = useState(false);
  const fileRef = useRef(null);
  const [newImgFile, setNewImgFile] = useState(null);
  const [newImgUrl, setNewImgUrl] = useState();
  const [newRegion, setNewRegion] = useState(region);
  const [newBirth, setNewBirth] = useState(birth);

  const onEditImage = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
    setIsEdit(true);
  };

  const onChangeImage = (e) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) {
      setIsEdit(false);
      return;
    }
    setNewImgFile(targetFile);
    setNewImgUrl(URL.createObjectURL(targetFile));
  };

  return (
    <div className="bg-white h-fit w-1/2 max-w-[28rem] p-8 rounded-sm flex flex-col justify-center items-center gap-4 relative z-1">
      <div className="w-1/3 aspect-square rounded-full relative">
        {isEdit ? (
          <>
            <LazyImg
              src={newImgUrl ? newImgUrl : profile_image}
              alt="edit_img"
              className="w-full h-full rounded-full"
            />
            <CircleX
              size="1.5rem"
              className="absolute right-[5%] bottom-[5%] cursor-pointer"
              color={Colors.bgDarkGray}
              strokeWidth={3}
              onClick={() => {
                setIsEdit(false);
                setNewImgUrl(null);
                setNewImgFile(null);
              }}
            />
          </>
        ) : (
          <>
            <LazyImg
              src={profile_image}
              alt="profile_image"
              className="w-full h-full rounded-full"
            />
            <EditLayer htmlFor="file" onClick={onEditImage}>
              <Image size="33%" color="white" />
            </EditLayer>
          </>
        )}
        <input
          id="file"
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onChangeImage}
        />
      </div>
    </div>
  );
};

export default ProfileEditModal;
