import { SortKey } from '@/types/post';
import { create } from 'zustand';

interface PostState {
  page: number;
  sort: SortKey;
  setPage: (v: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  setSort: (v: SortKey) => void;
}

export const usePostStore = create<PostState>((set) => ({
  page: 1,
  sort: 'recent',
  setPage: (v) => set({ page: v }),
  prevPage: () => set((state) => ({ page: state.page - 1 })),
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  setSort: (v) => set({ sort: v }),
}));
