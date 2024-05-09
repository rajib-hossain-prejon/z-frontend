import React, { FormEvent } from 'react';
import { HeadFC, Link as GLink, navigate } from 'gatsby';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Img,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import coverImage from '../static/cover-image.png';
import logo from '../static/zoxxo_CLR.png';
import ContinueWithGoogleButton from '../components/ContinueWithGoogleButton';
import { IRegisterData, register as registerUser } from '../api/auth';
import Error from '../components/Error';
import useAuth from '../hooks/useAuth';
import { When } from 'react-if';
import Loader from '../components/Loader';

export default function Signup() {
  const { t } = useTranslation(['auth', 'common', 'uploader']);
  const { user, isGettingLoggedIn } = useAuth();

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(
    (vals: IRegisterData) => registerUser(vals),
    {
      onSuccess: () => navigate('/signin'),
      onError: (e: any) => setErr(e.message),
    },
  );

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required(t('validations:full-name-is-required')),
      email: Yup.string().email(t('validations:invalid-email')).required(t('validations:email-is-required')),
      username: Yup.string().required(t('validations:username-is-required')),
      password: Yup.string()
        .min(8, t('validations:password-min-length'))
        .required(t('validations:password-is-required')),
    }),
    onSubmit: (values) => {
      setErr(() => '');
      mutate(values);
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
            >
              {t('uploader:deliver-your-data-fast-line')}
            </Text>
            <ContinueWithGoogleButton
              mt="74px"
              onSuccess={() => navigate('/dashboard', { replace: true })}
            />
            <Box className="flex items-center" my="46px" w="full">
              <Divider borderColor="primary.500" flexGrow={1} />
              <Text fontSize="lg" color="primary.500" px={2}>
                {t('common:or')}
              </Text>
              <Divider borderColor="primary.500" flexGrow={1} />
            </Box>
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
                      formik.touched.fullName && formik.errors.fullName,
                    )}
                  >
                    <Input
                      borderColor="gray.600"
                      type="text"
                      size="lg"
                      placeholder={t('auth:name-or-company')}
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                    />
                    <When
                      condition={
                        formik.errors.fullName && formik.touched.fullName
                      }
                    >
                      <FormHelperText color="red.500">
                        {formik.errors.fullName}
                      </FormHelperText>
                    </When>
                  </FormControl>
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
                  <FormControl
                    isInvalid={Boolean(
                      formik.touched.username && formik.errors.username,
                    )}
                  >
                    <Input
                      borderColor="gray.600"
                      type="text"
                      size="lg"
                      placeholder={t('common:username')}
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                    />
                    <When
                      condition={
                        formik.errors.username && formik.touched.username
                      }
                    >
                      <FormHelperText color="red.500">
                        {formik.errors.username}
                      </FormHelperText>
                    </When>
                  </FormControl>
                  <FormControl
                    isInvalid={Boolean(
                      formik.touched.password && formik.errors.password,
                    )}
                  >
                    <Input
                      borderColor="gray.600"
                      type="password"
                      size="lg"
                      placeholder={t('auth:password')}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                    <When
                      condition={
                        formik.errors.password && formik.touched.password
                      }
                    >
                      <FormHelperText color="red.500">
                        {formik.errors.password}
                      </FormHelperText>
                    </When>
                  </FormControl>
                </Box>
                <Text
                  textAlign="center"
                  maxW="280px"
                  fontSize="small"
                  letterSpacing={0}
                  mx="auto"
                >
                  {t('auth:by-creating-an-account-you-agree')}{' '}
                  <Link target='_blank' href="https://zoxxo.space/terms-of-service/" color="primary.500" textDecor="underline">
                    {t('auth:terms-of-service')}
                  </Link>{' '}
                  {t('common:and')}{' '}
                  <Link
                    target='_blank'
                    href="https://zoxxo.space/privacy-policy/"
                    color="primary.500"
                    textDecor="underline"
                  >
                    {t('auth:privacy-and-cookie')}
                  </Link>
                  &nbsp;{t('common:statement')}.
                </Text>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="solid"
                  colorScheme="primary"
                >
                  {t('auth:create-zoxxo-account')}
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
