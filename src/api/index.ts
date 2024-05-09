import axios, { InternalAxiosRequestConfig } from 'axios';
import IUpload from '../interfaces/IUpload';
import IWorkspace from '../interfaces/IWorkspace';
import { isBrowser } from '../utils';
import ICampaign from '../interfaces/ICampaign';

const instance = axios.create({
  baseURL: `${process.env.GATSBY_BACKEND_URL}`,
  withCredentials: true, // for sending cookies,
});

// Adding interceptor so that on every request, authorization header should be available
instance.interceptors.request.use((c: InternalAxiosRequestConfig<any>) => {
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

instance.interceptors.response.use(
  (res) => Promise.resolve(res.data),
  (err) => Promise.reject(err.response?.data || { message: err.message }),
);

export const getUploadLinks = (fs: { name: string; size: number }[]) => {
  return instance.post<
    any,
    { uploadUrls: string[]; upload: { _id: string }; emailToken: string }
  >('/uploads', {
    files: fs.map((f) => ({ name: f.name, size: f.size })),
  });
};

export const verifyUploadCompletion = (
  uploadId: string,
  data?: { email: string; title: string; emailToken: string },
) => {
  return instance.post(`/uploads/${uploadId}`, { emailData: data });
};

export const getUploadInfo = (uploadId: string) => {
  return instance.get<any, IUpload & { links: string[] }>(
    '/uploads/' + uploadId,
  );
};

export const getDownloadLinks = (uploadId: string) => {
  return instance.get<any, { link: string }>(
    `/uploads/${uploadId}/download-links`,
  );
};

export const getWorkspaceInfo = (workspaceId: string) => {
  return instance.get<
    any,
    IWorkspace & { user: { _id: string; fullName: string; avatar: string } }
  >(`/workspaces/${workspaceId}`);
};

export const getDefaultWorkspace = (username: string) => {
  return instance.get<
    any,
    IWorkspace & { user: { _id: string; fullName: string; avatar: string } }
  >(`/default-workspace/${username}`);
};

export const getCampaign = (display: string) => {
  return instance.get<any, ICampaign>(`/campaigns/${display}`);
};

export const incrementClicks = (campaignId: string, token: string) => {
  return instance.put<any, { success: string }>(
    `/campaigns/clicks/${campaignId}`,
    { token },
  );
};

export const emailToUploader = (uploadId: string, content: string) => {
  return instance.post<any, { success: string }>(`/uploads/${uploadId}/email`, {
    content,
  });
};
