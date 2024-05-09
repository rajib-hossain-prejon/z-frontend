import React, { PropsWithoutRef } from 'react';
import { Box, Button, ButtonProps, Icon } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

import SvgGoogle from './icons/SvgGoogle';
import Error from './Error';
import { googleLogin } from '../api/auth';
import useAuth from '../hooks/useAuth';

function GoogleButton(
  props: PropsWithoutRef<ButtonProps & { onSuccess?: Function }>,
) {
  const { t } = useTranslation('auth');
  const { login: stateLogin } = useAuth();

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation((val: string) => googleLogin(val), {
    onSuccess: (d) => {
      stateLogin(d, d.token);
      if (typeof props.onSuccess === 'function') props.onSuccess();
    },
    onError: (err) => setErr((err as any)?.message || ''),
  });

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    scope: 'email profile',
    onError: (e) => setErr(e.error || ''),
    onSuccess: (r) => mutate(r.code),
  });
  return (
    <React.Fragment>
      <Button
        display="inline-flex"
        variant="unstyled"
        rounded="9999px"
        leftIcon={
          <Box
            w="40px"
            h="40px"
            bgColor="white"
            rounded="9999px"
            className="flex items-center justify-center"
            pos="absolute"
            left={0}
            top={0}
          >
            <Icon as={SvgGoogle} w="22px" h="22px" />
          </Box>
        }
        bgColor="blue.100"
        alignItems="center"
        pos="relative"
        maxW="400px"
        w="full"
        mx="auto"
        {...props}
        isLoading={isLoading}
        onClick={(e) => {
          login();
          setErr('');
          if (props.onClick) props.onClick(e);
        }}
      >
        {t('continue-with-google')}
      </Button>
      <Error message={err} my={2} />
    </React.Fragment>
  );
}

export default function ContinueWithGoogleButton(
  props: PropsWithoutRef<ButtonProps & { onSuccess?: Function }>,
) {
  return (
    <GoogleOAuthProvider clientId={process.env.GATSBY_GOOGLE_CLIENT_ID || ''}>
      <GoogleButton {...props} />
    </GoogleOAuthProvider>
  );
}
