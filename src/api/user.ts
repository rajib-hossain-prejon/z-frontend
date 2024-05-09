import axios, {
  AxiosInterceptorOptions,
  InternalAxiosRequestConfig,
} from 'axios';

import IWorkspace from '../interfaces/IWorkspace';
import IUpload from '../interfaces/IUpload';
import { isBrowser, objectToFormData } from '../utils';
import ICampaign from '../interfaces/ICampaign';
import IInvoice from '../interfaces/IInvoice';

const userApi = axios.create({
  baseURL: `${process.env.GATSBY_BACKEND_URL}/users`,
  withCredentials: true, // for sending cookies,
});

// Adding interceptor so that on every request, authorization header should be available
userApi.interceptors.request.use((c: InternalAxiosRequestConfig<any>) => {
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

userApi.interceptors.response.use(
  (res) => Promise.resolve(res.data),
  (err) => Promise.reject(err.response?.data || { message: err.message }),
);

// account
export const changeUsername = (username: string) => {
  return userApi.post<any, { username: string }>('/username', { username });
};

export const changeAvatar = (avatar: File) => {
  const fd = new FormData();
  fd.append('avatar', avatar);
  return userApi.post(`/avatar`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changeLanguage = (language: string) => {
  return userApi.post('/language', { language });
};

export const changeDefaultworkspace = (workspaceId: string) => {
  return userApi.post('/default-workspace', { defaultWorkspace: workspaceId });
};

export const changeUrl = (url: string) => {
  return userApi.post<any, { zoxxoUrl: string }>('/zoxxo-url', {
    zoxxoUrl: url,
  });
};

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return userApi.post('/password', data);
};

export const changeEmail = (data: { email: string; password: string }) => {
  return userApi.post('/email', data);
};

export const updateBillingDetails = (data: {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  vatNumber: string;
}) => {
  return userApi.post('/billing', data);
};

export const updatePaymentMethod = (data: {
  service: 'stripe' | 'paypal';
  stripeCardData?: {
    stripeId: string;
    nameOnCard: string;
    brand: 'visa' | 'mastercard';
    last4: string;
  };
}) => {
  return userApi.post('/payment-method', data);
};

export const upgradePlan = (data: {
  extraStorage: number;
  extraWorkspaces: number;
  subscription: 'monthly' | 'yearly';
}) => {
  return userApi.post<
    any,
    { subscriptionId: string; invoiceLink?: string; planId: string }
  >('/subscription', data);
};

export const downgradePlan = () => {
  return userApi.put('/subscription');
};

export const verifyPaypalSubscription = (data: {
  extraStorage: number;
  extraWorkspaces: number;
  subscription: 'monthly' | 'yearly';
  paypalSubscriptionId: string;
}) => {
  return userApi.post('/upgrade-plan/paypal-confirmation', data);
};

export const getInvoices = () => {
  return userApi.get<any, IInvoice[]>('/invoices');
}

export const deleteUser = () => {
  return userApi.delete('/');
}

// workspaces
interface IWorkspacePopulated extends IWorkspace {
  uploads: IUpload[];
}

export const createWorkspace = (name: string) => {
  return userApi.post<any, IWorkspace>('/workspaces', { name });
};

export const getWorkspaces = () => {
  return userApi.get<any, IWorkspacePopulated[]>('/workspaces');
};

export const getWorkspace = (_id: string) => {
  return userApi.get<any, IWorkspacePopulated>(`/workspaces/${_id}`);
};

export const renameWorkspace = (_id: string, newName: string) => {
  return userApi.post<any, IWorkspace>(`/workspaces/${_id}/name`, {
    name: newName,
  });
};

export const uploadWorkspaceCoverImage = (_id: string, coverImage: File) => {
  const fd = new FormData();
  fd.append('coverImage', coverImage);
  return userApi.post(`/workspaces/${_id}/cover-image`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getWorkspaceUploadLinks = (
  _id: string,
  data: {
    files: {
      name: string;
      size: number;
    }[];
    coverImage?: File;
    color?: string;
  },
) => {
  const fd = new FormData();
  data.files.forEach((f) => {
    fd.append('files', f.name);
    fd.append('sizes', f.size.toString());
  });
  if (data.coverImage) fd.append('coverImage', data.coverImage);
  if (data.color) fd.append('color', data.color);
  return userApi.post<any, { uploadUrls: string[]; upload: IUpload }>(
    `/workspaces/${_id}/uploads`,
    fd,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const getUpdateUploadLinks = (
  _id: string,
  uploadId: string,
  data: {
    files: {
      name: string;
      size: number;
    }[];
    deletedFiles?: string[];
    coverImage?: File;
    color?: string;
  },
) => {
  const fd = new FormData();
  data.files.forEach((f) => {
    fd.append('newFileNames', f.name);
    fd.append('sizes', f.size.toString());
  });
  data.deletedFiles?.forEach((f) => fd.append('deletedFiles', f));
  if (data.deletedFiles?.length === 1) {
    // append an extra dummy name so that deleteFiles is parsed as array on backend
    fd.append('deletedFiles', '....');
  }
  if (data.coverImage) fd.append('coverImage', data.coverImage);
  if (data.color) fd.append('color', data.color);
  return userApi.put<
    any,
    { uploadUrls: { name: string; url: string }[]; upload: IUpload }
  >(`/workspaces/${_id}/uploads/${uploadId}`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const validateUploadCompletion = (
  workspaceId: string,
  uploadId: string,
  files?: { name: string; size: number }[],
) => {
  return userApi.post(`/workspaces/${workspaceId}/uploads/${uploadId}`, {
    files,
  });
};

export const updateUploadName = (
  workspaceId: string,
  uploadId: string,
  name: string,
) => {
  return userApi.put<any, IUpload>(
    `/workspaces/${workspaceId}/uploads/${uploadId}/name`,
    { name },
  );
};

export const moveUpload = (data: {
  currentWorkspaceId: string;
  targetWorkspaceId: string;
  uploadId: string;
}) => {
  return userApi.put(
    `/workspaces/${data.currentWorkspaceId}/uploads/${data.uploadId}/move/${data.targetWorkspaceId}`,
  );
};

export const deleteUpload = (workspaceId: string, uploadId: string) => {
  return userApi.delete<any, IUpload>(
    `/workspaces/${workspaceId}/uploads/${uploadId}`,
  );
};

export const deleteWorkspace = (workspaceId: string) => {
  return userApi.delete<any, { _id: string }>(
    `/workspaces/${workspaceId}`,
  );
};

// campaigns
export const createCampaign = (data: {
  title: string;
  description: string;
  display: ('upload-screen' | 'download-screen')[];
  isABTesting: boolean;
  creative: {
    url: string;
    image: File;
  };
  creativeABTesting?: {
    url: string;
    image: File;
  };
  startDate: string;
  endDate: string;
}) => {
  // removing ab testing creative if it has no url or image name
  let d = data;
  if (!d.creativeABTesting?.url || !d.creativeABTesting?.image?.name) {
    d.creativeABTesting = undefined;
  }
  const fd = objectToFormData(d);
  return userApi.post<any, { _id: string }>('/campaigns', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCampaigns = () => {
  return userApi.get<any, ICampaign[]>('/campaigns');
};

export const getCampaign = (id: string) => {
  return userApi.get<any, ICampaign>(`/campaigns/${id}`);
};

export const payCampaign = (id: string) => {
  return userApi.put<any, ICampaign & { orderId?: string }>(
    `/campaigns/${id}/payment`,
  );
};

export const captureCampaignOrder = (campaignId: string, orderId: string) => {
  return userApi.put<any, ICampaign>(
    `/campaigns/${campaignId}/capture/${orderId}`,
  );
};
