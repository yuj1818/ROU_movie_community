'use client';

import { MovieDetail } from '@/types/movie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { createMovieReview, getMovieInfo } from '@/lib/client/movie';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '@/types/post';
import { createPost, editPostInfo, getPostInfo } from '@/lib/client/post';

interface FormValues {
  title: string;
  content: string;
}

export default function PostCreationForm({
  movieId,
  isEdit,
}: {
  movieId?: number;
  isEdit: boolean;
}) {
  const isReview = !!movieId;
  const router = useRouter();
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const queryClient = useQueryClient();

  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfo(movieId!),
    enabled: isReview,
  });

  const { data: post } = useQuery<Post>({
    queryKey: ['post', reviewId],
    queryFn: async () => getPostInfo(reviewId),
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (form: FormValues) => {
      if (isEdit) return editPostInfo(reviewId, form);
      if (isReview) return createMovieReview(movieId, form);
      return createPost(form);
    },
    onSuccess: (data) => {
      if (isEdit) {
        queryClient.setQueryData(['post', reviewId], (old: Post) =>
          old ? { ...old, ...data } : old,
        );
      }
      router.replace(`/post/${data.id}`);
    },
  });

  const [formValues, setFormValues] = useState<FormValues>({
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
    mutation.mutate(formValues);
  };

  useEffect(() => {
    if (post) {
      setFormValues({
        title: post.title,
        content: post.content,
      });
    }
  }, [post]);

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
            mutation.isPending ||
            formValues.title.trim() === '' ||
            formValues.content.trim() === ''
          }
        >
          {isEdit ? '수정' : '작성'}
        </Button>
      </div>
    </form>
  );
}
