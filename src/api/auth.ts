import axios, { InternalAxiosRequestConfig } from 'axios';

import IUser from '../interfaces/IUser';
import { isBrowser } from '../utils';

const authInstance = axios.create({
  baseURL: `${process.env.GATSBY_BACKEND_URL}/auth`,
  withCredentials: true, // for sending cookies,
});

// Adding interceptor so that on every request, authorization header should be available
authInstance.interceptors.request.use((c: InternalAxiosRequestConfig<any>) => {
  const updated = {
    ...c,
    headers: {
      ...c.headers,
      Authorization: isBrowser()
        ? `${localStorage.getItem('zoxxo-token')}`
        : '',
    },
  };
  return updated as InternalAxiosRequestConfig<any>;
});

authInstance.interceptors.response.use(
  (res) => Promise.resolve(res.data),
  (err) => Promise.reject(err.response?.data || { message: err.message }),
);

export interface IRegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}
interface IRegisterResponse {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  token: string;
}
export const register = (data: IRegisterData) => {
  return authInstance.post<any, IRegisterResponse>('/register', data);
};

export interface ILoginData {
  email: string;
  password: string;
}
export const login = (data: ILoginData) => {
  return authInstance.post<any, (IUser & { token: string })>('/login', data);
};

export const googleLogin = (code: string) => {
  return authInstance.post<any, (IUser & { token: string })>(
    `/google-login?authCode=${code}`,
  );
};

// variable for preventing repeated calls
let promise: Promise<IUser> | null | undefined;
export const getLoggedIn = () => {
  if (promise) return promise;
  else {
    promise = authInstance.get<any, IUser>('/');
    return Promise.resolve(promise).finally(() => {
      promise = null;
    });
  }
};

export const logoutUser = () => {
  return authInstance.get('/logout');
};

export const sendResetPasswordEmail = (email: string) => {
  return authInstance.post('/forgot-password', { email });
};

export const resetPassword = (newPassword: string, token: string) => {
  return authInstance.post('/reset-password', { newPassword, token });
};

export const resendEmailVerificationMail = (email: string) => {
  return authInstance.post('/resend-email-verification-mail', { email });
};
