import tw from 'tailwind-styled-components';
import { MessageSquareMore, ThumbsUp, ThumbsDown } from 'lucide-react';
import LazyImg from '../common/LazyImg';
import unknown from '../../assets/profile.png';
import { useNavigate } from 'react-router-dom';

const IconContainer = tw.div`
  flex h-[1rem] items-center text-xs text-black
`;

const ReviewInfo = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-4 w-full h-[5rem] px-6 py-4 bg-white rounded-md"
      onClick={() => navigate(`/review/${data.id}`)}
    >
      <LazyImg
        className="w-[3rem] h-[3rem] rounded-full"
        src={
          data.review_writor.profile_image
            ? data.review_writor.profile_image
            : unknown
        }
        alt="user_img"
      />
      <div className="grow flex flex-col gap-2 text-black min-w-0">
        <p className="text-base overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {data.title}
        </p>
        <p className="text-sm font-pretendard_exlight overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {data.content}
        </p>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-2">
          <IconContainer>
            <MessageSquareMore className="h-full" />
            <p>{data.comment_count}</p>
          </IconContainer>
          <IconContainer>
            <ThumbsUp className="h-full" />
            <p>{data.like_count}</p>
          </IconContainer>
          <IconContainer>
            <ThumbsDown className="h-full" />
            <p>{data.dislike_count}</p>
          </IconContainer>
        </div>
        <p
          className="underline underline-offset-2 cursor-pointer text-xs font-pretendard_exlight text-gray-400 whitespace-nowrap text-right"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${data.review_writor.id}`);
          }}
        >
          by. {data.review_writor.username}
        </p>
      </div>
    </div>
  );
};

export default ReviewInfo;
