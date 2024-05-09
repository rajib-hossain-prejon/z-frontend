import { create } from 'zustand';
import React from 'react';

import IUser from '../interfaces/IUser';
import { isBrowser } from '../utils';
import IWorkspace from '../interfaces/IWorkspace';
import { getLoggedIn, logoutUser } from '../api/auth';
import deepMerge from '../utils/deepMerge';
import { useLanguage } from '../i18n';

interface IUseAuth {
  user: IUser | null;
  isGettingLoggedIn: boolean;
  setIsGettingLoggedIn: (val: boolean) => any;
  updateUser: (usr: IUser & Record<string, any>) => void;
  setUser: (usr: IUser) => void;
  login: (usr: IUser, token: string) => void;
  logout: () => void;
  // workspace functions
  /* addWorkspace: (name: string) => any;
  deleteWorkspace: (id: string) => any; */
}

const useAuthState = create<IUseAuth>((set, get) => ({
  user: null,
  /* isBrowser() && sessionStorage.getItem('zoxxo-user')
      ? JSON.parse(sessionStorage.getItem('zoxxo-user') as string)
      : null, */
  isGettingLoggedIn: true,
  setIsGettingLoggedIn: (val: boolean) => {
    set(() => ({ isGettingLoggedIn: val }));
  },
  updateUser: (usr: Record<string, any>) => {
    set((st) => {
      if (!st.user) return st;
      const newUsr = deepMerge(st.user, usr) as IUser;
      /* if (isBrowser()) {
        sessionStorage.setItem('zoxxo-user', JSON.stringify(newUsr));
      } */
      return {
        user: newUsr,
      };
    });
  },
  setUser: (usr: IUser) => {
    /* if (isBrowser()) {
      sessionStorage.setItem('zoxxo-user', JSON.stringify(usr));
    } */
    set((st) => ({
      user: usr,
    }));
  },
  login: (usr: IUser, token: string) => {
    if (isBrowser()) {
      localStorage.setItem('zoxxo-token', token);
      // sessionStorage.setItem('zoxxo-user', JSON.stringify(usr));
    }
    set(() => ({
      user: usr,
    }));
  },
  logout: () => {
    if (isBrowser()) {
      localStorage.removeItem('zoxxo-token');
      // sessionStorage.removeItem('zoxxo-user');
    }
    set(() => ({
      user: null,
    }));
  },
  // workspace functions
  /* addWorkspace: (name: string) => {
    set((st) => ({
      ...st,
      user: {
        ...st.user!,
        workspaces: [...st.user!.workspaces, {name, _id: '1234', user: st.user!}]
      }
    }))
  },
  deleteWorkspace: (id: string) => {
    set((st) => ({
      ...st,
      user: {
        ...st.user!,
        workspaces: st.user!.workspaces.filter((ws) => ws._id !== id),
      }
    }))
  } */
}));

// intermediate hook for handling logout and login
const useAuth = () => {
  const { changeLanguage } = useLanguage();
  const {
    user,
    isGettingLoggedIn,
    setIsGettingLoggedIn,
    setUser,
    login,
    logout: lgOut,
  } = useAuthState();

  const refetchUser = () => {
    if (!user) setIsGettingLoggedIn(true);
    return getLoggedIn()
      .then((usr) => {
        setUser(usr);
        changeLanguage(usr?.language);
      })
      .catch((err) => err)
      .finally(() => (!user ? setIsGettingLoggedIn(false) : null));
  };

  return {
    isGettingLoggedIn,
    user,
    setUser,
    refetchUser,
    login,
    logout: () => logoutUser().then(() => lgOut()),
  };
};

export default useAuth;
