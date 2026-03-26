const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/quiz';

export const createQuiz = async (data: FormData) => {
  const res = await fetch(`${URL}`, { method: 'POST', body: data });

  if (!res.ok) throw new Error(`퀴즈 생성 실패`);

  return res.json();
};

export const getQuizzes = async (limit: number) => {
  const res = await fetch(`${URL}?limit=${limit}`, { method: 'GET' });

  if (!res.ok) throw new Error(`퀴즈 조회 실패`);

  return res.json();
};
