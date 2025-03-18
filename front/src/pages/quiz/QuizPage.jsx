import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import {
  restart,
  setLimit,
  setQuizIds,
  setQuizStatus,
} from '../../stores/quiz';
import { useEffect } from 'react';
import { getQuizData } from '../../utils/quizAPI';
import QuizDetailBox from '../../components/quiz/QuizDetailBox';
import QuizResultBox from '../../components/quiz/QuizResultBox';
import { useLocation } from 'react-router-dom';

const Title = styled.h1`
  font-size: 8rem;
  letter-spacing: 0.1em;
  background: linear-gradient(
    ${Colors.btnPurple} 50%,
    ${Colors.btnDarkPurple} 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-family: 'PartialSansKR-Regular';
  filter: drop-shadow(3px 3px 1px rgba(255, 255, 255, 0.5));
`;

const Button = styled.button`
  width: 10rem;
  background-color: ${Colors.btnSkyBlue};
  color: #fbfbfb;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
`;

const QuizPage = () => {
  const { limit, quizStatus, curQuizStatus } = useSelector(
    (state) => state.quiz,
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const selectLimit = (limit) => {
    dispatch(setLimit(limit));
  };

  useEffect(() => {
    if (limit === null) return;
    const getQuizzes = async () => {
      const res = await getQuizData({ limit });
      dispatch(setQuizIds(res));
      dispatch(setQuizStatus(1));
    };

    getQuizzes();

    return () => {
      dispatch(restart());
    };
  }, [limit]);

  return quizStatus === 0 ? (
    <div className="py-12 px-8 w-full h-full flex flex-col justify-center items-center text-white gap-16">
      <Title>QUIZ</Title>
      <div className="flex gap-4">
        <Button onClick={() => selectLimit(10)}>10개 풀기</Button>
        <Button onClick={() => selectLimit(20)}>20개 풀기</Button>
        <Button onClick={() => selectLimit(30)}>30개 풀기</Button>
      </div>
    </div>
  ) : quizStatus === 2 || curQuizStatus === 1 ? (
    <QuizResultBox />
  ) : (
    <QuizDetailBox />
  );
};

export default QuizPage;
