import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
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

const ReviewCreationForm = () => {
  const { movieInfo } = useSelector((state) => state.movie);
  const params = useParams();
  const [isReview, setIsReview] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (params.movie_id) {
      if (params.movie_id == 0) {
        setIsReview(false);
      } else {
        setIsReview(true);
      }
    }
  }, [params.movie_id]);

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <div className="flex flex-col justify-center gap-4 text-white w-1/2 min-w-[25rem]">
      {isReview && (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-pretendard_semibold">{`"${movieInfo.title}"`}</span>
          <span className="text-xl">리뷰 작성</span>
        </div>
      )}
      <div className="w-full flex flex-col gap-2 text-black">
        <input
          className="p-2 rounded-sm w-full outline-none"
          type="text"
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          name="content"
          id="content"
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ReviewCreationForm;
