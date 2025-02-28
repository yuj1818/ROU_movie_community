import dayjs from 'dayjs';
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../constants/Colors';
import tw from 'tailwind-styled-components';
import { useNavigate } from 'react-router-dom';
import { dislikePost, likePost } from '../../utils/communityApi';
import { toggleDislike, toggleLike } from '../../stores/community';

const IconContainer = tw.div`
  flex gap-1 text-sm items-center
`;

const PostDetailInfo = () => {
  const { postInfo } = useSelector((state) => state.community);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickLike = async () => {
    const res = await likePost(postInfo.id);
    dispatch(toggleLike(res.like_count));
  };

  const onClickDislike = async () => {
    const res = await dislikePost(postInfo.id);
    dispatch(toggleDislike(res.dislike_count));
  };

  return (
    postInfo && (
      <div className="w-1/2 bg-white rounded-lg p-6 flex flex-col gap-2">
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
                by. {postInfo.review_writor.username}
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
            onClick={() => navigate(-1)}
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
        <div className="w-full whitespace-pre-line">{postInfo.content}</div>
      </div>
    )
  );
};

export default PostDetailInfo;
