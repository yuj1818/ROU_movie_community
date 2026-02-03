import { create } from 'zustand';

interface TagState {
  isTagOpen: boolean;
  selectedTag: number;
  sectionRefs: Record<number, HTMLElement | null>;
  openTag: () => void;
  selectTag: (tagId: number) => void;
  registerSection: (id: number, el: HTMLElement | null) => void;
}

export const useTagStore = create<TagState>()((set, get) => ({
  isTagOpen: false,
  selectedTag: 20,
  sectionRefs: {},
  openTag: () => set((state) => ({ isTagOpen: !state.isTagOpen })),
  selectTag: (tagId) => {
    set({ selectedTag: tagId });

    const el = get().sectionRefs[tagId];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  },
  registerSection: (id, el) =>
    set((state) => ({
      sectionRefs: { ...state.sectionRefs, [id]: el },
    })),
}));
