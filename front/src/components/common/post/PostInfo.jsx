import tw from 'tailwind-styled-components';
import { MessageSquareMore, ThumbsUp, ThumbsDown } from 'lucide-react';
import LazyImg from '../LazyImg';
import unknown from '../../../assets/profile.png';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const IconContainer = tw.div`
  flex h-[1rem] items-center text-xs text-black
`;

const Content = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: 'Pretendard-ExtraLight';
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: -webkit-box;
  white-space: pre-line;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const PostInfo = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center gap-4 w-full h-[5rem] px-6 py-4 bg-white rounded-md"
      onClick={() =>
        navigate(`/review/${data.id}`, { state: { from: location.pathname } })
      }
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
        <p className="text-base overflow-hidden text-ellipsis max-w-full">
          {data.title}
        </p>
        <Content>{data.content}</Content>
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
          by. {data.review_writor.nickname}
        </p>
      </div>
    </div>
  );
};

export default PostInfo;
