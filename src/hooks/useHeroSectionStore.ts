import { create } from 'zustand';

interface IHeroSectionStore {
  files: File[];
  addFiles: (files: File[]) => void;
  removeFile: (filename: string) => void;
  isSeeMore: boolean;
  toggleSeeMore: (value: boolean | null | undefined) => void;
  shareVia: 'email' | 'link';
  setShareVia: (via: 'email' | 'link') => void;
  reset: () => any;
}

const defaultState: {
  files: File[];
  isSeeMore: boolean;
  shareVia: 'email' | 'link';
} = {
  files: [],
  isSeeMore: false,
  shareVia: 'email',
};

const useHeroSectionStore = create<IHeroSectionStore>((set) => ({
  ...defaultState,
  addFiles: (files: File[]) => {
    return set((st) => ({ files: [...st.files, ...files] }));
  },
  removeFile: (filename: string) => {
    return set((st) => ({
      files: st.files.filter((f) => f.name !== filename),
    }));
  },
  toggleSeeMore: (value: boolean | null | undefined) => {
    if (typeof value !== 'boolean')
      set((st) => ({
        isSeeMore: !st.isSeeMore,
      }));
    else
      set((st) => ({
        isSeeMore: value,
      }));
  },
  setShareVia: (via: 'email' | 'link') => {
    return set((st) => ({
      shareVia: via,
    }));
  },
  reset: () => set((st) => ({ ...st, ...defaultState })),
}));

export default useHeroSectionStore;
