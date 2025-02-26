import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { closeModal } from '../../stores/modal';
import TrailerModal from '../movie/TrailerModal';
import ProfileEditModal from '../profile/ProfileEditModal';
import ConfirmModal from '../profile/ConfirmModal';
import PreferenceEditModal from '../profile/PreferenceEditModal';

const MODAL_TYPES = {
  trailer: 'trailer',
  profile: 'profile',
  confirm: 'confirm',
  genre: 'genre',
};

const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.trailer,
    component: <TrailerModal />,
  },
  {
    type: MODAL_TYPES.profile,
    component: <ProfileEditModal />,
  },
  {
    type: MODAL_TYPES.confirm,
    component: <ConfirmModal />,
  },
  {
    type: MODAL_TYPES.genre,
    component: <PreferenceEditModal />,
  },
];

const Modal = () => {
  const { modalType, isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      dispatch(closeModal());
    }
  }, [location]);

  if (!isOpen) return;

  const findModal = MODAL_COMPONENTS.find((modal) => {
    return modal.type === modalType;
  });

  const renderModal = () => {
    return findModal?.component;
  };

  return (
    <div className="fixed z-5 inset-0">
      <div
        className="fixed inset-0 pl-[213px] bg-white opacity-30"
        onClick={() => dispatch(closeModal())}
      />
      <div className="pl-[213px] w-full h-full flex justify-center items-center">
        {renderModal()}
      </div>
    </div>
  );
};

export default Modal;
