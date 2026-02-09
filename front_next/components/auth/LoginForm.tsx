'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import FormField from './FormField';
import TextInput from './TextInput';
import { useRouter } from 'next/navigation';
import { LoginFormData } from '@/types/auth';
import Image from 'next/image';

export default function LoginForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      ...formValues,
      redirect: false,
    });

    if (res?.error) {
      setError('아이디 또는 비밀번호가 틀렸습니다');
      return;
    }

    router.push('/');
  };

  return (
    <div className="w-1/2 min-w-100 py-6 flex flex-col gap-2 bg-muted border rounded-lg items-center max-w-150">
      <h3 className="font-semibold text-2xl text-center">로그인</h3>
      <form className="w-2/3 flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField label="아이디" htmlFor="username">
          <TextInput
            type="text"
            id="username"
            name="username"
            onChange={onChange}
          />
        </FormField>
        <FormField label="비밀번호" htmlFor="password">
          <TextInput
            type="password"
            id="password"
            name="password"
            onChange={onChange}
          />
        </FormField>
        {error && <span className="text-sm text-red-500">{error}</span>}
        <Button>로그인</Button>
      </form>
      <Button variant="link" onClick={() => router.push('/register')}>
        회원가입
      </Button>
      <button
        className="rounded-md w-2/3 flex items-center p-3 cursor-pointer shadow border"
        style={{ backgroundColor: '#FEE500' }}
      >
        <Image src="/kakao_logo.svg" alt="kakao_logo" width={18} height={18} />
        <span className="flex-1 min-w-0 text-sm text-center text-black/85 font-semibold">
          카카오 로그인
        </span>
      </button>
      <button className="rounded-md w-2/3 flex items-center p-3 cursor-pointer bg-white border shadow">
        <Image
          src="/google_logo.svg"
          alt="google_logo"
          width={18}
          height={18}
        />
        <span className="flex-1 min-w-0 text-sm text-center text-black/54 font-semibold">
          Google 로그인
        </span>
      </button>
    </div>
  );
}
