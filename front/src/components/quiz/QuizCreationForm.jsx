import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { createQuiz } from '../../utils/quizAPI';
import tw from 'tailwind-styled-components';
import { Image } from 'lucide-react';
import LazyImg from '../common/LazyImg';
import Colors from '../../constants/Colors';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Label = tw.label`
  font-pretendard_semibold text-xl
`;

const InputText = tw.input`
  text-black p-2 rounded-sm
`;

const InputRadio = styled.input`
  appearance: none;
  vertical-align: center;
  border: max(2px, 0.1rem) solid gray;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;

  &:checked {
    border: 0.4rem solid ${Colors.btnPurple};
  }
`;

const QuizCreationForm = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('다음 영화 장면 속 대사는?');
  const [imgFile, setImgFile] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [choices, setChoices] = useState([
    { id: 1, choice_text: '', is_correct: 1 },
    { id: 2, choice_text: '', is_correct: 0 },
    { id: 3, choice_text: '', is_correct: 0 },
    { id: 4, choice_text: '', is_correct: 0 },
  ]);

  const onChangeImage = (e) => {
    const targetFile = e.target.files?.[0];
    setImgFile(targetFile);
    setImgUrl(URL.createObjectURL(targetFile));
  };

  const onChangeChoice = (id, text) => {
    setChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, choice_text: text } : choice,
      ),
    );
  };

  const onSubmit = async () => {
    const res = await createQuiz({
      question,
      quiz_image: imgFile,
      items: JSON.stringify(
        choices.map((choice) => ({
          choice_text: choice.choice_text,
          is_correct: choice.is_correct,
        })),
      ),
    });
    window.alert('퀴즈가 생성됨!!');
  };

  return (
    <div className="text-white flex flex-col gap-6 w-full max-w-[36rem]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="question">질문</Label>
        <InputText
          id="question"
          type="text"
          value={question}
          placeholder="질문을 입력하세요"
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>이미지 등록</Label>
        <label className="w-2/3 self-center" htmlFor="image">
          <div className="w-full aspect-video bg-gray-400 rounded-sm flex flex-col justify-center items-center">
            {imgFile ? (
              <LazyImg className="w-full h-full" src={imgUrl} />
            ) : (
              <>
                <span>퀴즈 이미지를 업로드해주세요</span>
                <Image size="50%" />
              </>
            )}
          </div>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={onChangeImage}
          hidden
        />
      </div>
      <div className="flex flex-col gap-2">
        {choices &&
          choices.map((choice, idx) => (
            <div key={choice.id} className="flex gap-3 items-center">
              <Label className="w-[4.5rem]">선택지 {idx + 1}</Label>
              <InputText
                className="flex-grow"
                type="text"
                value={choice.choice_text}
                onChange={(e) => onChangeChoice(choice.id, e.target.value)}
              />
              <InputRadio
                type="radio"
                name="correctChoice"
                checked={choice.is_correct}
                onChange={() => onChangeIsCorrect(choice.id)}
              />
            </div>
          ))}
      </div>
      <div className="flex gap-2">
        <Button
          $background="black"
          $boxShadow="0 0 0 1.5px white inset"
          $width={5}
          $fontSize={1}
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
        <Button
          $marginLeft={0}
          $background={Colors.btnPurple}
          $width={5}
          $fontSize={1}
          onClick={onSubmit}
          disabled={
            (question.trim() === '') |
            !imgFile |
            choices.some((choice) => choice.choice_text.trim() === '')
          }
        >
          제출
        </Button>
      </div>
    </div>
  );
};

export default QuizCreationForm;
