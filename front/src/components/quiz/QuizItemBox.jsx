import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { setQuizIds, setQuizIdx, setQuizStatus } from '../../stores/quiz';

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
  const onClickItem = async () => {
    if (quizIdx < quizIds.length - 1) {
      dispatch(setQuizIdx(quizIdx + 1));
    } else {
      dispatch(setQuizStatus(2));
    }
  };

  return (
    <div
      className="w-full rounded bg-white overflow-hidden"
      onClick={onClickItem}
    >
      <Container>{data.choice_text}</Container>
    </div>
  );
};

export default QuizItemBox;
