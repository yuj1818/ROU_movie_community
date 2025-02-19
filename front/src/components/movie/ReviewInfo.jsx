import tw from 'tailwind-styled-components';
import { MessageSquareMore, ThumbsUp, ThumbsDown } from 'lucide-react';

const IconContainer = tw.div`
  flex h-[1rem] items-center text-xs text-black
`;

const ReviewInfo = ({ data }) => {
  return (
    <div className="flex items-center gap-4 w-full h-[5rem] px-6 py-4 bg-white rounded-md">
      <img
        className="w-[3rem] h-[3rem] rounded-full"
        src={import.meta.env.VITE_API_URL + data.review_writor.profile_image}
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
            <p>{data.like_review_users.length}</p>
          </IconContainer>
          <IconContainer>
            <ThumbsDown className="h-full" />
            <p>{data.dislike_review_users.length}</p>
          </IconContainer>
        </div>
        <p className="text-xs font-pretendard_exlight text-gray-400 whitespace-nowrap text-right">
          by. {data.review_writor.username}
        </p>
      </div>
    </div>
  );
};

export default ReviewInfo;
