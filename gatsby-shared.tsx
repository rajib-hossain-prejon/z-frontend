import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import useAuth from './src/hooks/useAuth';

import './src/i18n';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      networkMode: 'always', // always execute irrespect of network availability
    },
    mutations: {
      retry: 0,
      networkMode: 'always', // always execute irrespect of network availability
    },
  },
});

export default function GatsbyShared({ children }) {
  const { user, refetchUser } = useAuth();
  React.useEffect(() => {
    if (!user) {
      refetchUser();
    }
  }, []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
