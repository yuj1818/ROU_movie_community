import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../Button';
import Colors from '../../../constants/Colors';
import { createMovieReview } from '../../../utils/movieApi';
import { createPost, editPostData } from '../../../utils/communityApi';
import { setPostInfo } from '../../../stores/community';

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 0.25rem;
  resize: none;
  aspect-ratio: 4 / 3;
  max-height: 25rem;
  outline: none;

  &::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 20px;
  }
`;

const PostCreationForm = ({ isReview, isEdit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieInfo } = useSelector((state) => state.movie);
  const { postInfo } = useSelector((state) => state.community);
  const [title, setTitle] = useState(() => {
    if (isEdit) {
      return postInfo.title;
    } else {
      return '';
    }
  });
  const [content, setContent] = useState(() => {
    if (isEdit) {
      return postInfo.content;
    } else {
      return '';
    }
  });

  const onSubmit = async () => {
    let res;
    if (isEdit) {
      res = await editPostData(postInfo.id, {
        title,
        content,
      });
    } else {
      if (isReview) {
        res = await createMovieReview(movieInfo.movie_id, {
          title,
          content,
        });
      } else {
        res = await createPost({
          title,
          content,
        });
      }
    }
    navigate(`/review/${res.id}`, { state: { from: location.state?.from } });
  };

  return (
    <div className="flex flex-col justify-center gap-4 text-white w-1/2 min-w-[25rem]">
      {isReview && (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-pretendard_semibold">{`"${movieInfo.title}"`}</span>
          <span className="text-xl">리뷰 {isEdit ? '수정' : '작성'}</span>
        </div>
      )}
      <div className="w-full flex flex-col gap-2 text-black">
        <input
          className="py-2 px-4 rounded-sm w-full outline-none"
          type="text"
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <TextArea
          name="content"
          id="content"
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </div>
      <div className="flex gap-2">
        <Button $background={Colors.btnGray} onClick={() => navigate(-1)}>
          취소
        </Button>
        <Button
          $marginLeft={0}
          $background={Colors.btnPurple}
          onClick={onSubmit}
        >
          {isEdit ? '수정' : '작성'}
        </Button>
      </div>
    </div>
  );
};

export default PostCreationForm;
