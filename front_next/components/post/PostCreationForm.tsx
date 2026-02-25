'use client';

import { MovieDetail } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { createMovieReview, getMovieInfo } from '@/lib/client/movie';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostCreationForm({
  movieId,
  isEdit,
}: {
  movieId: number | null;
  isEdit: boolean;
}) {
  const isReview = !!movieId;
  const router = useRouter();
  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      if (!isReview) return null;
      const res = await getMovieInfo(movieId);
      return res;
    },
    enabled: isReview,
  });
  const [formValues, setFormValues] = useState<{
    title: string;
    content: string;
  }>({
    title: '',
    content: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isEdit) {
    } else {
      if (isReview) {
        const res = await createMovieReview(movieId, formValues);

        if (res) alert('리뷰 작성 완료');
      } else {
      }
    }
  };

  return (
    <form
      className="w-full flex flex-col justify-center gap-4"
      onSubmit={onSubmit}
    >
      {isReview && (
        <h3 className="flex items-end gap-2">
          <span className="text-2xl font-semibold">{`"${movie?.title}"`}</span>
          <span className="text-xl">리뷰 {isEdit ? '수정' : '작성'}</span>
        </h3>
      )}
      <div className="w-full flex flex-col gap-2">
        <input
          name="title"
          type="text"
          className="px-4 py-3 w-full rounded bg-white/10 border border-input outline-none"
          placeholder="제목을 입력하세요"
          onChange={onChange}
          value={formValues.title}
        />
        <div className="px-4 py-3 w-full rounded bg-white/10 border border-input aspect-3/4 max-h-100">
          <textarea
            name="content"
            className="w-full h-full resize-none outline-none"
            placeholder="내용을 입력하세요"
            onChange={onChange}
            value={formValues.content}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="secondary"
          className="border border-input"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={
            formValues.title.trim() === '' || formValues.content.trim() === ''
          }
        >
          {isEdit ? '수정' : '작성'}
        </Button>
      </div>
    </form>
  );
}
