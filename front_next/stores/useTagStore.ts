import { create } from 'zustand';

interface TagState {
  selectedTag: number;
  selectTag: (tagId: number) => void;
}

export const useTagStore = create<TagState>()((set, get) => ({
  selectedTag: 20,
  selectTag: (tagId) => set({ selectedTag: tagId }),
}));
