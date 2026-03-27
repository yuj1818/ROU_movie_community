import { useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '../ui/button';
import { useQuizStore } from '@/stores/useQuizStore';
import { useShallow } from 'zustand/shallow';

export default function QuizResultBox({
  is_correct,
  correct_answer,
}: {
  is_correct: boolean;
  correct_answer: string;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    quizIdx,
    limit,
    quizStatus,
    setQuizStatus,
    setQuizIdx,
    setCurQuizStatus,
  } = useQuizStore(
    useShallow((state) => ({
      quizIdx: state.quizIdx,
      limit: state.limit,
      quizStatus: state.quizStatus,
      setQuizStatus: state.setQuizStatus,
      setQuizIdx: state.setQuizIdx,
      setCurQuizStatus: state.setCurQuizStatus,
    })),
  );

  const onClickNext = () => {
    if (quizIdx === limit! - 1) {
      setQuizStatus(2);
    } else {
      setQuizIdx(quizIdx + 1);
      setCurQuizStatus(0);
    }
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (quizStatus === 1 && e.key === 'Enter') {
      onClickNext();
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  return (
    <div
      className="w-4/5 relative h-full flex flex-col gap-4 justify-center items-center focus:outline-none"
      ref={divRef}
      tabIndex={0}
      onKeyDown={onEnter}
    >
      <DotLottieReact
        className="absolute w-auto h-2/3 max-h-full max-w-full z-0"
        src={
          is_correct ? '/lottie/congratulations.lottie' : '/lottie/oops.lottie'
        }
        loop
        autoplay
      />
      <div className="relative z-2 flex flex-col gap-12 justify-center items-center">
        <span className="font-display text-4xl tracking-widest">
          {is_correct ? '정답입니다!' : '틀렸습니다!'}
        </span>
        <span className="text-center text-xl text-primary px-4 py-2 rounded font-semibold text-shadow-[1px_1px_1px_rgba(255, 255, 255, 0.8)]">
          "{correct_answer}"
        </span>
        <Button className="text-base px-4 py-3" onClick={onClickNext}>
          {quizIdx === limit! - 1 ? '결과 보기' : '다음'}
        </Button>
      </div>
    </div>
  );
}
