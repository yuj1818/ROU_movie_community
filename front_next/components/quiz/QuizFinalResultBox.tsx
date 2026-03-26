import { useQuizStore } from '@/stores/useQuizStore';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useShallow } from 'zustand/shallow';
import { Button } from '../ui/button';

export default function QuizFinalResultBox() {
  const { score, limit, restart } = useQuizStore(
    useShallow((state) => ({
      score: state.score,
      limit: state.limit,
      restart: state.restart,
    })),
  );

  return (
    <div className="w-4/5 relative h-full flex flex-col gap-4 justify-center items-center focus:outline-none">
      <DotLottieReact
        className="absolute w-auto h-2/3 max-h-full max-w-full z-0"
        src={'/lottie/finish.lottie'}
        loop
        autoplay
      />
      <div className="relative z-2 flex flex-col gap-12 justify-center items-center">
        <div className="font-display text-3xl tracking-widest text-center">
          <span className="text-primary mr-2">
            {score} / {limit}
          </span>
          <span>문제를 맞추셨습니다</span>
        </div>
        <Button className="text-base px-4 py-3" onClick={restart}>
          다시하기
        </Button>
      </div>
    </div>
  );
}
