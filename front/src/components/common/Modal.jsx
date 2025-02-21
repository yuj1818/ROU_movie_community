import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { closeModal } from '../../stores/modal';
import TrailerModal from '../movie/TrailerModal';

const MODAL_TYPES = {
  trailer: 'trailer',
};

const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.trailer,
    component: <TrailerModal />,
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
