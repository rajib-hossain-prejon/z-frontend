import { create } from 'zustand';

interface IEditUploadFileStore {
  deletedFiles: string[];
  files: File[];
  addFiles: (files: File[]) => void;
  removeFile: (filename: string) => void;
  isSeeMore: boolean;
  toggleSeeMore: (value: boolean | null | undefined) => void;
  color: string;
  setColor: (via: string) => void;
  image: File | null | undefined;
  setImage: (img: File) => void;
  reset: () => void;
}

const defaultState = {
  deletedFiles: [],
  files: [],
  isSeeMore: false,
  color: '',
  image: null,
};

const useEditUploadFileStore = create<IEditUploadFileStore>((set) => ({
  ...defaultState,
  addFiles: (files: File[]) => {
    return set((st) => ({ files: [...st.files, ...files] }));
  },
  removeFile: (filename: string) => {
    return set((st) => ({
      files: st.files.filter((f) => f.name !== filename),
      deletedFiles: [...st.deletedFiles, filename],
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
  setColor: (via: string) => {
    return set((st) => ({
      color: via,
    }));
  },
  setImage: (img: File) => {
    return set((st) => ({
      image: img,
    }));
  },
  reset: () => {
    return set((st) => defaultState);
  },
}));

export default useEditUploadFileStore;
