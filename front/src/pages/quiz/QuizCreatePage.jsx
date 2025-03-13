import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { createQuiz } from '../../utils/quizAPI';

const QuizCreatePage = () => {
  const [question, setQuestion] = useState('');
  const [imgFile, setImgFile] = useState();
  const [choices, setChoices] = useState([
    { id: 1, choice_text: '', is_correct: 1 },
    { id: 2, choice_text: '', is_correct: 0 },
    { id: 3, choice_text: '', is_correct: 0 },
    { id: 4, choice_text: '', is_correct: 0 },
  ]);

  const onChangeImage = (e) => {
    const targetFile = e.target.files?.[0];
    console.log(targetFile);
    setImgFile(targetFile);
  };

  const handleChoiceChange = (id, text) => {
    setChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, choice_text: text } : choice,
      ),
    );
  };

  const handleCorrectChange = (id) => {
    setChoices((prev) =>
      prev.map((choice) => ({
        ...choice,
        is_correct: choice.id === id,
      })),
    );
  };

  const handleSubmit = async () => {
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
    console.log(res);
  };

  return (
    <div className="text-white">
      <label htmlFor="question">문제</label>
      <input
        className="text-black"
        id="question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <label htmlFor="image">이미지</label>
      <input type="file" accept="image/*" onChange={onChangeImage} />
      {choices &&
        choices.map((choice, idx) => (
          <div key={choice.id}>
            <label>문항 {idx + 1}</label>
            <input
              className="text-black"
              type="text"
              value={choice.choice_text}
              onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
            />
            <input
              className="text-black"
              type="radio"
              name="correctChoice"
              checked={choice.is_correct}
              onChange={() => handleCorrectChange(choice.id)}
            />
          </div>
        ))}
      <Button onClick={handleSubmit}>제출</Button>
    </div>
  );
};

export default QuizCreatePage;
