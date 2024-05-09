import React, { FormEvent } from 'react';
import { HeadFC, Link as GLink, navigate } from 'gatsby';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Img,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { When } from 'react-if';
import { useTranslation } from 'react-i18next';

import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import coverImage from '../static/cover-image.png';
import logo from '../static/zoxxo_CLR.png';
import { sendResetPasswordEmail } from '../api/auth';
import Error from '../components/Error';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { user, isGettingLoggedIn } = useAuth();

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(
    (vals: string) => sendResetPasswordEmail(vals),
    {
      onSuccess: () => {
        // navigate('/change-password', { replace: true });
      },
      onError: (e: any) => setErr(e.message),
    },
  );

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('validations:invalid-email')).required(t('validations:email-is-required')),
    }),
    onSubmit: (values) => {
      setErr(() => '');
      mutate(values.email);
    },
  });

  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  return (
    <Layout>
      <Box
        className="flex flex-wrap"
        h="100vh"
        overflow={isGettingLoggedIn ? 'hidden' : 'auto'}
      >
        <When condition={isGettingLoggedIn}>
          <Box
            bgColor="rgba(255, 255, 255, 0.4)"
            className="flex"
            pos="absolute"
            inset={0}
            zIndex={100}
          >
            <Loader />
          </Box>
        </When>
        <Box
          bgImage="linear-gradient(-135deg,#cdf7f6 0.00%,#9a94bc 100.00%)"
          w={{ base: 'full', lg: '55%' }}
          minH="50vh"
          className="flex items-center justify-center"
          pos="relative"
          order={{ base: 2, lg: 1 }}
          p={4}
        >
          <Box
            as={Img}
            src={coverImage}
            alt="cover image"
            w={{ base: '65%', sm: '55%', md: '60%', lg: '75%' }}
            m="auto"
          />
        </Box>
        <Box
          className="flex flex-col"
          w={{ base: 'full', lg: '45%' }}
          bgColor="gray.50"
          py="76px"
          px="2.5"
          order={{ base: 1, lg: 2 }}
        >
          <Box
            className="flex flex-col justify-center items-center"
            w="full"
            maxW="430px"
            m="auto"
          >
            <Box as={GLink} to="/" w="70px">
              <Box as={Img} src={logo} alt="zoxxo logo" w="full" />
            </Box>
            <Text fontSize="44px" textAlign="center" mt="74px">
              {t('auth:create-your-box')}
            </Text>
            <Text
              color="gray.500"
              textAlign="center"
              fontSize="2xl"
              mx="auto"
              maxW="360px"
              mb="7vh"
            >
              {t('uploader:deliver-your-data-fast-line')}
            </Text>
            <Error message={err} mb={8} />
            <form
              style={{ width: '100%' }}
              onSubmit={(e) =>
                formik.handleSubmit(e as FormEvent<HTMLFormElement>)
              }
            >
              <Stack spacing={8}>
                <Box className="flex flex-col" gap="12px">
                  <FormControl
                    isInvalid={Boolean(
                      formik.touched.email && formik.errors.email,
                    )}
                  >
                    <Input
                      borderColor="gray.600"
                      type="text"
                      size="lg"
                      placeholder="Email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    <When
                      condition={formik.errors.email && formik.touched.email}
                    >
                      <FormHelperText color="red.500">
                        {formik.errors.email}
                      </FormHelperText>
                    </When>
                  </FormControl>
                </Box>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="solid"
                  colorScheme="primary"
                >
                  {t('auth:send-reset-email')}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO />;
