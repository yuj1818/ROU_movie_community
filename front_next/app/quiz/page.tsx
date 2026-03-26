'use client';

import Title from '@/components/common/Title';
import QuizDetailBox from '@/components/quiz/QuizDetailBox';
import QuizFinalResultBox from '@/components/quiz/QuizFinalResultBox';
import { Button } from '@/components/ui/button';
import { getQuizzes } from '@/lib/client/quiz';
import { useQuizStore } from '@/stores/useQuizStore';
import { Quiz } from '@/types/quiz';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

export default function QuizPage() {
  const { quizStatus, quizIdx, curQuizStatus, setLimit, setQuizStatus } =
    useQuizStore(
      useShallow((state) => ({
        quizStatus: state.quizStatus,
        quizIdx: state.quizIdx,
        curQuizStatus: state.curQuizStatus,
        setLimit: state.setLimit,
        setQuizStatus: state.setQuizStatus,
      })),
    );

  const { mutate, data, isPending } = useMutation({
    mutationFn: (limit: number) => getQuizzes(limit),
    onSuccess: () => setQuizStatus(1),
  });

  return (
    <div className="w-4/5 h-full py-12 flex flex-col justify-center items-center gap-16">
      {quizStatus === 0 && (
        <>
          <h2 className="font-display text-[8rem] tracking-widest bg-linear-to-b from-primary from-50% to-sky-600 to-100% bg-clip-text text-transparent">
            Quiz
          </h2>
          <div className="flex gap-4">
            {[10, 20, 30].map((n) => (
              <Button
                key={n}
                className="text-base"
                size="lg"
                onClick={() => {
                  setLimit(n);
                  mutate(n);
                }}
              >
                {n}개 풀기
              </Button>
            ))}
          </div>
        </>
      )}
      {quizStatus === 1 && !isPending && (
        <QuizDetailBox quizId={data[quizIdx]} />
      )}
      {quizStatus === 2 && <QuizFinalResultBox />}
    </div>
  );
}
