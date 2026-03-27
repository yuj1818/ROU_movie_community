import { cn } from '@/lib/utils';
import type { QuizItem as QItem } from '@/types/quiz';
import { useState } from 'react';

export default function QuizItem({
  id,
  choice_text,
  disabled,
  selectAnswer,
}: QItem & { disabled: boolean; selectAnswer: (ansId: number) => void }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className="w-full rounded bg-white overflow-hidden"
      onClick={() => {
        if (disabled) return;
        setIsSelected(true);
        selectAnswer(id);
      }}
    >
      <div
        className={cn(
          'w-full bg-primary px-3 py-2 text-sm cursor-pointer',
          disabled ? 'cursor-not-allowed bg-muted' : 'hover:opacity-70',
          isSelected ? 'inset-ring-2 inset-ring-primary/50' : '',
        )}
      >
        {choice_text}
      </div>
    </div>
  );
}
