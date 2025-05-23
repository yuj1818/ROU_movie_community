import dayjs from 'dayjs';
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../constants/Colors';
import tw from 'tailwind-styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { dislikePost, likePost } from '../../utils/communityApi';
import {
  setConfirmType,
  toggleDislike,
  toggleLike,
} from '../../stores/community';
import LazyImg from '../common/LazyImg';
import Url from '../../constants/URL';
import { Button } from '../common/Button';
import { getCookie } from '../../utils/cookie';
import { openModal } from '../../stores/modal';
import CommentList from './CommentList';
import { checkLogin } from '../../utils/authApi';

const IconContainer = tw.div`
  flex gap-1 text-sm items-center
`;

const PostDetailInfo = () => {
  const { postInfo } = useSelector((state) => state.community);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onClickLike = async () => {
    if (checkLogin()) {
      const res = await likePost(postInfo.id);
      dispatch(toggleLike(res.like_count));
    } else {
      window.alert('로그인 후, 사용해주세요');
    }
  };

  const onClickDislike = async () => {
    if (checkLogin()) {
      const res = await dislikePost(postInfo.id);
      dispatch(toggleDislike(res.dislike_count));
    } else {
      window.alert('로그인 후, 사용해주세요');
    }
  };

  return (
    postInfo && (
      <div className="w-2/3 bg-white rounded-lg p-6 flex flex-col gap-3">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-pretendard_semibold text-xl">
              {postInfo.title}
            </h1>
            <div className="flex gap-2 font-pretendard_exlight text-sm">
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() =>
                  navigate(`/profile/${postInfo.review_writor.id}`)
                }
              >
                by. {postInfo.review_writor.nickname}
              </span>
              <span>{dayjs(postInfo.created_at).format('YYYY-MM-DD')}</span>
              <span className="text-gray-500">
                {dayjs(postInfo.created_at).fromNow()}
              </span>
            </div>
          </div>
          <X
            className="cursor-pointer"
            size="1.75rem"
            color={Colors.btnGray}
            onClick={() => {
              if (location.state?.from) {
                navigate(location.state.from, { replace: true });
              } else {
                navigate(-1);
              }
            }}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <IconContainer>
            <ThumbsUp
              fill={postInfo.isLike ? Colors.btnDarkPurple : 'none'}
              className="cursor-pointer"
              onClick={onClickLike}
            />
            <span>{postInfo.like_count}</span>
          </IconContainer>
          <IconContainer>
            <ThumbsDown
              fill={postInfo.isDislike ? Colors.btnDarkPurple : 'none'}
              className="cursor-pointer"
              onClick={onClickDislike}
            />
            <span>{postInfo.dislike_count}</span>
          </IconContainer>
        </div>
        <div className="w-full flex">
          {postInfo.review_movie && (
            <div className="w-1/4 min-w-[9rem] min-h-[12rem] pr-4">
              <div className="w-full aspect-3/4">
                <LazyImg
                  className="w-full h-full"
                  src={Url.tmdbImgPath + postInfo.review_movie.poster_path}
                />
              </div>
            </div>
          )}
          <div className="w-3/4 whitespace-pre-line">{postInfo.content}</div>
        </div>
        {postInfo.review_writor.id == getCookie('userId') && (
          <div className="flex gap-2">
            <Button
              $background="red"
              onClick={() => {
                dispatch(setConfirmType('post'));
                dispatch(openModal('delete'));
              }}
            >
              삭제
            </Button>
            <Button
              $marginLeft={0}
              onClick={() =>
                navigate(`/review/edit/${postInfo.id}`, {
                  state: { from: location.state.from },
                })
              }
            >
              수정
            </Button>
          </div>
        )}
        <CommentList />
      </div>
    )
  );
};

export default PostDetailInfo;
