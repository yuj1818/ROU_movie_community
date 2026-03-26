import { checkQuizAns, getQuiz } from '@/lib/client/quiz';
import { useQuizStore } from '@/stores/useQuizStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import Title from '../common/Title';
import { Quiz } from '@/types/quiz';
import Image from 'next/image';
import QuizItem from './QuizItem';
import { useShallow } from 'zustand/shallow';
import QuizResultBox from './QuizResultBox';

export default function QuizDetailBox({ quizId }: { quizId: number }) {
  const { curQuizStatus, setCurQuizStatus, addScore } = useQuizStore(
    useShallow((state) => ({
      quizIdx: state.quizIdx,
      curQuizStatus: state.curQuizStatus,
      setCurQuizStatus: state.setCurQuizStatus,
      addScore: state.addScore,
    })),
  );

  const { data: quiz, isFetching } = useQuery<Quiz>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId),
  });

  const {
    data: result,
    isPending,
    mutate,
  } = useMutation({
    mutationFn: (ansId: number) => checkQuizAns(quizId, { answer: ansId }),
    onSuccess: (data: { is_correct: boolean; correct_answer: string }) => {
      if (data.is_correct) {
        addScore();
      }
      setCurQuizStatus(1);
    },
  });

  if (!quiz) return;

  if (isFetching) return <div>Loading...</div>;

  if (curQuizStatus === 0)
    return (
      <div className="w-4/5 flex flex-col gap-4 items-center justify-center">
        <Title size="lg">{quiz.question}</Title>
        <div className="w-full max-w-100 aspect-video rounded overflow-hidden relative">
          <Image
            className="w-full h-full"
            src={`/api/media/${quiz.quiz_image}`}
            alt={`quiz_${quizId}`}
            fill
            sizes="300px"
          />
        </div>
        <div className="flex max-w-100 flex-col w-full gap-2">
          {quiz.items.map((item) => (
            <QuizItem key={item.id} selectAnswer={mutate} {...item} />
          ))}
        </div>
      </div>
    );

  if (curQuizStatus === 1 && result) return <QuizResultBox {...result} />;

  return;
}
