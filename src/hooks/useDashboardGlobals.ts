import { create } from 'zustand';

interface IDashboardGlobalsStore {
  isSidebarOpen: boolean;
  toggleOpenSideBar: (value?: boolean) => void;
}

const useDashboardGlobals = create<IDashboardGlobalsStore>((set) => ({
  isSidebarOpen: false,
  toggleOpenSideBar: (value?: boolean) => {
    if (typeof value !== 'boolean')
      set((st) => ({
        isSidebarOpen: !st.isSidebarOpen,
      }));
    else
      set((st) => ({
        isSidebarOpen: value,
      }));
  },
}));

export default useDashboardGlobals;
