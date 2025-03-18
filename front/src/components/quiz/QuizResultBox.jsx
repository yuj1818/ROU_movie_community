import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../common/Button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import rightAnswer from '../../assets/congratulations.lottie';
import wrongAnswer from '../../assets/oops.lottie';
import finish from '../../assets/finish.lottie';
import {
  restart,
  setCurQuizStatus,
  setQuizIdx,
  setQuizStatus,
} from '../../stores/quiz';
import Colors from '../../constants/Colors';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';

const AnswerBox = styled.span`
  font-size: 1.2rem;
  color: ${Colors.btnPurple};
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-family: 'Pretendard-SemiBold';
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
`;

const QuizResultBox = () => {
  const { quizStatus, curQuizRes, quizIdx, quizIds, count } = useSelector(
    (state) => state.quiz,
  );
  const dispatch = useDispatch();
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  const onClickNext = () => {
    if (quizIdx === quizIds.length - 1) {
      dispatch(setQuizStatus(2));
    } else {
      dispatch(setQuizIdx(quizIdx + 1));
    }
    dispatch(setCurQuizStatus(0));
  };

  const onEnter = (e) => {
    if (quizStatus === 1 && e.key === 'Enter') {
      onClickNext();
    }
  };

  return (
    <div
      className="text-white relative w-4/5 h-full flex flex-col gap-4 items-center justify-center focus:outline-none"
      ref={divRef}
      onKeyDown={(e) => onEnter(e)}
      tabIndex={0}
    >
      {quizStatus === 1 ? (
        <>
          <DotLottieReact
            className="absolute w-auto h-2/3 max-h-full max-w-full z-0"
            src={curQuizRes.is_correct ? rightAnswer : wrongAnswer}
            loop
            autoplay
          />
          <div className="relative z-2 flex flex-col gap-12 justify-center items-center">
            <p className="font-partial_sans text-4xl tracking-widest">
              {curQuizRes.is_correct ? '정답입니다!' : '틀렸습니다!'}
            </p>
            <AnswerBox>"{curQuizRes.correct_answer}"</AnswerBox>
            <Button
              onClick={onClickNext}
              $marginTop={0}
              $marginLeft={0}
              $background={Colors.btnPurple}
            >
              {quizIdx === quizIds.length - 1 ? '결과 보기' : '다음'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <DotLottieReact
            className="absolute w-auto h-2/3 max-h-full max-w-full z-0"
            src={finish}
            loop
            autoplay
          />
          <div className="relative z-2 flex flex-col gap-12 justify-center items-center">
            <div className="font-partial_sans text-3xl tracking-widest text-center">
              <span className="text-main-purple mr-2">
                {count} / {quizIds.length}
              </span>
              <span className="text-white">문제를 맞추셨습니다.</span>
            </div>
            <Button
              $marginLeft={0}
              $marginTop={0}
              $background={Colors.btnPurple}
              onClick={() => dispatch(restart())}
            >
              다시 하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResultBox;
