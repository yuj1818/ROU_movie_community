import { create } from 'zustand';

interface QuizState {
  limit: number | null;
  quizStatus: 0 | 1 | 2; // 0: 시작전, 1: 진행중, 2: 종료
  quizIdx: number;
  curQuizStatus: 0 | 1; // 0: 진행중, 1: 완료,
  score: number;
  setLimit: (limit: number) => void;
  setQuizStatus: (status: 0 | 1 | 2) => void;
  setQuizIdx: (idx: number) => void;
  setCurQuizStatus: (status: 0 | 1) => void;
  addScore: () => void;
  restart: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  limit: null,
  quizStatus: 0,
  quizIdx: 0,
  curQuizStatus: 0,
  score: 0,
  setLimit: (limit) => set({ limit }),
  setQuizStatus: (quizStatus) => set({ quizStatus }),
  setQuizIdx: (quizIdx) => set({ quizIdx }),
  setCurQuizStatus: (curQuizStatus) => set({ curQuizStatus }),
  addScore: () => set((state) => ({ score: state.score + 1 })),
  restart: () =>
    set({
      limit: null,
      quizStatus: 0,
      quizIdx: 0,
      curQuizStatus: 0,
      score: 0,
    }),
}));
