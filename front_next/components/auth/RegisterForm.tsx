'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import FormField from './FormField';
import RegionSelect from './RegionSelect';
import TextInput from './TextInput';
import { register } from '@/lib/auth';
import { RegisterFormData } from '@/types/auth';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ isSocial }: { isSocial: boolean }) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegisterFormData>({
    username: '',
    password: '',
    password2: '',
    nickname: '',
    region: '',
    birth: '',
  });
  const [error, setError] = useState('');
  const [isValidPassword, setIsValidPassword] = useState<boolean | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await register(formValues);

    const data = await res.json();

    if (!res.ok) {
      if (Array.isArray(data)) {
        setError(data[0]);
      } else {
        setError(Object.values(data as Object)[0][0]);
      }
      return;
    }

    router.replace(isSocial ? '/' : 'login');
  };

  useEffect(() => {
    if (formValues.password) {
      if (formValues.password !== formValues.password2) {
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
    }
  }, [formValues.password2, formValues.password]);

  return (
    <div className="w-1/2 min-w-50 py-6 flex flex-col gap-4 bg-muted border rounded-lg items-center max-w-100">
      <h3 className="font-semibold text-2xl text-center">
        {isSocial ? '추가 정보 기입' : '회원가입'}
      </h3>
      <form className="w-2/3 flex flex-col gap-4" onSubmit={onSubmit}>
        {!isSocial && (
          <>
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
            <FormField label="비밀번호 재확인" htmlFor="password2">
              <TextInput
                type="password"
                id="password2"
                name="password2"
                onChange={onChange}
              />
              {isValidPassword !== null && (
                <span
                  className={cn(
                    'text-xs',
                    isValidPassword ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {isValidPassword
                    ? '비밀번호 일치'
                    : '비밀번호가 일치하지 않습니다'}
                </span>
              )}
            </FormField>
          </>
        )}
        <FormField label="닉네임" htmlFor="nickname">
          <TextInput
            type="text"
            id="nickname"
            name="nickname"
            onChange={onChange}
          />
        </FormField>
        <FormField label="지역">
          <RegionSelect
            onChange={(region) =>
              setFormValues((prev) => ({ ...prev, region }))
            }
          />
        </FormField>
        <FormField label="생년월일" htmlFor="birth">
          <TextInput type="date" id="birth" name="birth" onChange={onChange} />
        </FormField>
        {error && <span className="text-sm text-red-500">{error}</span>}
        <Button>회원가입</Button>
      </form>
    </div>
  );
}
