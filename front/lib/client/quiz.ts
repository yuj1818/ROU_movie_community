const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/quiz';

export const createQuiz = async (data: FormData) => {
  const res = await fetch(`${URL}`, { method: 'POST', body: data });

  if (!res.ok) throw new Error(`퀴즈 생성 실패`);

  return res.json();
};

export const getQuizzes = async (limit: number) => {
  const res = await fetch(`${URL}?limit=${limit}`);

  if (!res.ok) throw new Error(`퀴즈 목록 조회 실패`);

  return res.json();
};

export const getQuiz = async (quizId: number) => {
  const res = await fetch(`${URL}/${quizId}`);

  if (!res.ok) throw new Error('퀴즈 조회 실패');

  return res.json();
};

export const checkQuizAns = async (
  quizId: number,
  data: { answer: number },
) => {
  const res = await fetch(`${URL}/${quizId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('퀴즈 정답 제출 실패');

  return res.json();
};
