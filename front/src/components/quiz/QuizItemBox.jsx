import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { addCount, setCurQuizRes, setCurQuizStatus } from '../../stores/quiz';
import { checkQuizAnswer } from '../../utils/quizAPI';

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: ${Colors.btnSkyBlue};
  color: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const QuizItemBox = ({ data }) => {
  const { quizIdx, quizIds } = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  const onClickItem = async (answer) => {
    const res = await checkQuizAnswer(quizIds[quizIdx], { answer });
    if (res.is_correct) {
      dispatch(addCount());
    }
    dispatch(setCurQuizStatus(1));
    dispatch(setCurQuizRes(res));
  };

  return (
    <div
      className="w-full rounded bg-white overflow-hidden"
      onClick={() => onClickItem(data.id)}
    >
      <Container>{data.choice_text}</Container>
    </div>
  );
};

export default QuizItemBox;
