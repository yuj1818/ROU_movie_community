import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../stores/modal';
import { resign } from '../../utils/authApi';
import { useNavigate } from 'react-router-dom';

export const ConfirmModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCancel = () => {
    dispatch(closeModal());
  };

  const onConfirm = async () => {
    const res = await resign();
    if (res.status === 204) {
      navigate('/');
    } else {
      window.alert('탈퇴 실패');
    }
    dispatch(closeModal());
  };

  return (
    <div className="bg-white h-fit w-1/3 max-w-[20rem] p-8 rounded-sm flex flex-col justify-center items-center gap-6 relative z-1">
      <p className="text-sm text-black text-center">정말 탈퇴하시겠습니까?</p>
      <div className="flex gap-2">
        <Button
          $background="white"
          $boxShadow={`0 0 0 1px ${Colors.btnGray} inset`}
          $color={Colors.btnGray}
          onClick={onCancel}
        >
          취소
        </Button>
        <Button $background="red" onClick={onConfirm}>
          확인
        </Button>
      </div>
    </div>
  );
};
