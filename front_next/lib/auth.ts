import { RegisterFormData } from '@/types/auth';

const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/accounts';

export const register = async (data: RegisterFormData) => {
  return fetch(`${URL}/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
