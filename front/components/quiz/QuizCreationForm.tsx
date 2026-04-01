'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createQuiz } from '@/lib/client/quiz';

interface Choice {
  id: string;
  choice_text: string;
  is_correct: boolean;
}

const initialForm = {
  question: '',
  image: null,
  choices: [
    { id: '1', choice_text: '', is_correct: true },
    { id: '2', choice_text: '', is_correct: false },
    { id: '3', choice_text: '', is_correct: false },
    { id: '4', choice_text: '', is_correct: false },
  ],
};

export default function QuizCreationForm() {
  const [imgUrl, setImgUrl] = useState('');
  const [form, setForm] = useState<{
    question: string;
    image: File | null;
    choices: Choice[];
  }>(initialForm);

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;
    setForm((prev) => ({ ...prev, image: targetFile }));
    setImgUrl(URL.createObjectURL(targetFile));
  };

  const onChangeChoice = (idx: number, content: string) => {
    setForm((prev) => {
      const newChoices = [...prev.choices];
      newChoices[idx] = {
        ...newChoices[idx],
        choice_text: content,
      };
      return { ...prev, choices: newChoices };
    });
  };

  const onSelectAns = (id: string) => {
    setForm((prev) => ({
      ...prev,
      choices: prev.choices.map((c) => ({
        ...c,
        is_correct: c.id === id,
      })),
    }));
  };

  const isValid =
    form.question.trim() !== '' &&
    !!form.image &&
    form.choices.every((c) => c.choice_text.trim() !== '');

  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('question', form.question);
      formData.append('quiz_image', form.image!);
      formData.append(
        'items',
        JSON.stringify(
          form.choices.map((c) => ({
            choice_text: c.choice_text,
            is_correct: c.is_correct,
          })),
        ),
      );
      return createQuiz(formData);
    },
    onSuccess: () => {
      window.alert('퀴즈가 생성되었습니다');
      setForm(initialForm);
      setImgUrl('');
    },
    onError: () => {
      window.alert('퀴즈 생성에 실패했습니다');
    },
  });

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl p-6 border rounded bg-muted scheme-dark">
      <div className="flex flex-col gap-2">
        <label htmlFor="question">문제</label>
        <TextInput
          type="text"
          placeholder="문제를 입력하세요"
          id="question"
          className="border-muted-foreground"
          value={form.question}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, question: e.target.value }))
          }
        />
      </div>
      <label
        htmlFor="image"
        className="w-full aspect-video border border-muted-foreground p-4 rounded flex flex-col gap-2 items-center justify-center cursor-pointer relative overflow-hidden"
      >
        {form.image ? (
          <Image src={imgUrl} alt="문제 이미지" fill sizes="300px" />
        ) : (
          <>
            <span>퀴즈 이미지를 업로드해주세요</span>
            <ImageIcon className="size-1/2" />
          </>
        )}

        <input
          type="file"
          id="image"
          accept="image/*"
          className="hidden"
          onChange={onChangeImage}
        />
      </label>
      <RadioGroup
        className="w-full flex flex-col gap-2"
        defaultValue="1"
        onValueChange={onSelectAns}
      >
        {form.choices.map((c, idx) => (
          <Label
            htmlFor={idx.toString()}
            key={idx}
            className="w-full flex gap-3 items-center"
          >
            <span className="shrink-0">선택지 {idx + 1}</span>
            <TextInput
              type="text"
              className="flex-1 min-w-0 border-muted-foreground"
              placeholder="문항을 입력해주세요"
              value={c.choice_text}
              onChange={(e) => onChangeChoice(idx, e.target.value)}
            />
            <RadioGroupItem
              checked={c.is_correct}
              value={c.id}
              id={c.id}
              className="border-muted-foreground"
            />
          </Label>
        ))}
      </RadioGroup>
      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          size="lg"
          className="text-base"
          onClick={() => {
            setForm(initialForm);
            setImgUrl('');
          }}
        >
          초기화
        </Button>
        <Button
          size="lg"
          className="text-base"
          disabled={!isValid || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          퀴즈 생성
        </Button>
      </div>
    </div>
  );
}
