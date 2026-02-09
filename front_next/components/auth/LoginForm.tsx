'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import FormField from './FormField';
import TextInput from './TextInput';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LoginFormData } from '@/types/auth';

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

    const res = await login(formValues);

    if (!res.ok) {
      setError('아이디 또는 비밀번호가 틀렸습니다');
      return;
    }

    router.push('/');
  };

  return (
    <div className="w-1/2 min-w-50 py-6 flex flex-col gap-4 bg-muted border rounded-lg items-center max-w-100">
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
    </div>
  );
}
