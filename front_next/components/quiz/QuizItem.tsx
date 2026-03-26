import { checkQuizAns } from '@/lib/client/quiz';
import type { QuizItem as QItem } from '@/types/quiz';
import { useMutation } from '@tanstack/react-query';

export default function QuizItem({
  id,
  choice_text,
  selectAnswer,
}: QItem & { selectAnswer: (ansId: number) => void }) {
  return (
    <div
      className="w-full rounded bg-white overflow-hidden"
      onClick={() => selectAnswer(id)}
    >
      <div className="w-full bg-primary px-3 py-2 text-sm cursor-pointer hover:opacity-70">
        {choice_text}
      </div>
    </div>
  );
}
