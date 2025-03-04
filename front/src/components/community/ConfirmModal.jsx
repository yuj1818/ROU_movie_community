import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeModal } from '../../stores/modal';
import { deletePostData } from '../../utils/communityApi';
import { setPostInfo } from '../../stores/community';

export const ConfirmModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postInfo, confirmType } = useSelector((state) => state.community);

  const onCancel = () => {
    dispatch(closeModal());
  };

  const onConfirm = async () => {
    if (confirmType === 'post') {
      const res = await deletePostData(postInfo.id);
      if (res.status === 204) {
        if (postInfo.review_movie === null) {
          return;
        } else {
          navigate(`/movie/${postInfo.review_movie.movie_id}`);
        }
        dispatch(setPostInfo(null));
      } else {
        window.alert('게시글 삭제 실패');
      }
    } else {
      return;
    }
    dispatch(closeModal());
  };

  return (
    <div className="bg-white h-fit w-1/3 max-w-[20rem] p-8 rounded-sm flex flex-col justify-center items-center gap-6 relative z-1 shadow-md shadow-gray-500">
      <p className="text-sm text-black text-center">정말 삭제하시겠습니까?</p>
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
