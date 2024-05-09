import React, { FormEvent, PropsWithoutRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Heading,
  Img,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  StackItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { HeadFC, Link as GLink } from 'gatsby';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Case, Default, Else, If, Switch, Then, When } from 'react-if';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import pointingPerson from '../static/pointingPerson.png';
import ContinueWithGoogleButton from '../components/ContinueWithGoogleButton';
import { calculatePrice } from '../utils';
import { upgradePlan } from '../api/user';
import useAuth from '../hooks/useAuth';
import Error from '../components/Error';
import {
  ILoginData,
  IRegisterData,
  login as loginUser,
  register as registerUser,
} from '../api/auth';
import EmailNotVerifiedModal from '../components/EmailNotVerifiedModal';

interface ICard {
  setTab: (tab: 'login' | 'register') => void;
  onSuccess: () => void;
}

const LoginCard = ({ setTab, onSuccess }: PropsWithoutRef<ICard>) => {
  const { t } = useTranslation(['common', 'auth', 'uploader']);
  const { login } = useAuth();

  const { isOpen, onClose: _onClose, onOpen } = useDisclosure();

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(
    (vals: ILoginData) => loginUser(vals),
    {
      onSuccess: (d) => {
        login(d, d.token);
        onSuccess();
      },
      onError: (e: any) => {
        setErr(e.message);
        if (e.errorCode === 'EMAIL_NOT_VERIFIED') onOpen();
      },
    },
  );

  const onClose = () => {
    setErr('');
    _onClose();
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('validations:invalid-email')).required(t('validations:email-is-required')),
      password: Yup.string()
        .min(8, t('validations:password-min-length'))
        .required(t('validations:password-is-required')),
    }),
    onSubmit: (values) => {
      mutate(values);
    },
  });
  return (
    <Card variant="outline" shadow="md">
      <CardHeader
        px={0}
        pb={1}
        borderBottom="1.5px solid"
        borderColor="gray.200"
      >
        <Text px={5} fontSize="3xl">
          {t('auth:sign-in')}&nbsp;{t('common:or')}&nbsp;
          <Button
            variant="link"
            colorScheme="primary"
            textDecor="underline"
            fontSize="3xl"
            fontWeight="normal"
            onClick={() => setTab('register')}
          >
            {t('auth:register-now')}
          </Button>
        </Text>
      </CardHeader>
      <CardBody className="flex flex-col">
        <Text fontSize="44px" textAlign="center">
          {t('auth:login-to-your-box')}
        </Text>
        <Text
          color="gray.500"
          textAlign="center"
          fontSize="2xl"
          mx="auto"
          maxW="360px"
          letterSpacing="0px"
        >
          {t('uploader:deliver-your-data-fast-line')}
        </Text>
        <Stack
          spacing={8}
          mt="44px"
          as="form"
          onSubmit={(e: any) =>
            formik.handleSubmit(e as FormEvent<HTMLFormElement>)
          }
        >
          <Error message={err} />
          <Box className="flex flex-col" gap="12px">
            <FormControl
              isInvalid={Boolean(formik.errors.email && formik.touched.email)}
            >
              <Input
                borderColor="gray.600"
                type="text"
                size="lg"
                placeholder={t('auth:email')}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <When condition={formik.errors.email && formik.touched.email}>
                <FormHelperText color="red.500">
                  {formik.errors.email}
                </FormHelperText>
              </When>
            </FormControl>
            <FormControl
              isInvalid={Boolean(
                formik.errors.password && formik.touched.password,
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
                condition={formik.errors.password && formik.touched.password}
              >
                <FormHelperText color="red.500">
                  {formik.errors.password}
                </FormHelperText>
              </When>
            </FormControl>
          </Box>
          <Text
            as="button"
            textAlign="center"
            color="primary.500"
            letterSpacing={0}
          >
            {t('auth:forgot-password')}
          </Text>
          <Button
            variant="solid"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
          >
            {t('auth:login-to-your-zoxxo-account')}
          </Button>
          <EmailNotVerifiedModal email={formik.values.email} isOpen={isOpen} onClose={onClose} />
          <Box className="flex items-center">
            <Divider borderColor="primary.500" flexGrow={1} />
            <Text fontSize="lg" color="primary.500" px={2}>
              {t('common:or')}
            </Text>
            <Divider borderColor="primary.500" flexGrow={1} />
          </Box>
          <Box className="flex flex-col" gap="8px">
            <ContinueWithGoogleButton onSuccess={onSuccess} />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

const RegisterCard = ({ setTab, onSuccess }: PropsWithoutRef<ICard>) => {
  const { t } = useTranslation(['auth', 'common', 'uploader']);
  const { isLoading, mutate, error } = useMutation(
    (vals: IRegisterData) => registerUser(vals),
    {
      onSuccess: () => onSuccess(),
    },
  );
  const err = (error as any)?.message || '';

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
      mutate(values);
    },
  });

  return (
    <Card variant="outline" shadow="md">
      <CardHeader
        px={0}
        pb={1}
        borderBottom="1.5px solid"
        borderColor="gray.200"
      >
        <Text px={5} fontSize="3xl">
          {t('auth:register-now')}&nbsp;{t('common:or')}&nbsp;
          <Button
            variant="link"
            colorScheme="primary"
            textDecor="underline"
            fontSize="3xl"
            fontWeight="normal"
            onClick={() => setTab('login')}
          >
            {t('auth:sign-in')}
          </Button>
        </Text>
      </CardHeader>
      <CardBody className="flex flex-col">
        <Text fontSize="44px" textAlign="center">
          {t('auth:create-your-box')}
        </Text>
        <Text
          color="gray.500"
          textAlign="center"
          fontSize="2xl"
          mx="auto"
          maxW="360px"
          letterSpacing="0px"
        >
          {t('uploader:deliver-your-data-fast-line')}
        </Text>
        <Stack
          spacing={8}
          mt="44px"
          as="form"
          onSubmit={(e: any) =>
            formik.handleSubmit(e as FormEvent<HTMLFormElement>)
          }
        >
          <Error message={err} />
          <Box className="flex flex-col" gap="12px">
            <FormControl
              isInvalid={Boolean(
                formik.errors.fullName && formik.touched.fullName,
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
                condition={formik.errors.fullName && formik.touched.fullName}
              >
                <FormHelperText color="red.500">
                  {formik.errors.fullName}
                </FormHelperText>
              </When>
            </FormControl>
            <FormControl
              isInvalid={Boolean(formik.errors.email && formik.touched.email)}
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
              <When condition={formik.errors.email && formik.touched.email}>
                <FormHelperText color="red.500">
                  {formik.errors.email}
                </FormHelperText>
              </When>
            </FormControl>
            <FormControl
              isInvalid={Boolean(
                formik.errors.username && formik.touched.username,
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
                condition={formik.errors.username && formik.touched.username}
              >
                <FormHelperText color="red.500">
                  {formik.errors.username}
                </FormHelperText>
              </When>
            </FormControl>
            <FormControl
              isInvalid={Boolean(
                formik.errors.password && formik.touched.password,
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
                condition={formik.errors.password && formik.touched.password}
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
            variant="solid"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
          >
            {t('auth:create-zoxxo-account')}
          </Button>
          <Box className="flex items-center">
            <Divider borderColor="primary.500" flexGrow={1} />
            <Text fontSize="lg" color="primary.500" px={2}>
              {t('common:or')}
            </Text>
            <Divider borderColor="primary.500" flexGrow={1} />
          </Box>
          <Box className="flex flex-col" gap="8px">
            <ContinueWithGoogleButton onSuccess={onSuccess} />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default function Tornado() {
  const { t } = useTranslation(['common', 'tornado', 'pricing']);
  const { user, refetchUser } = useAuth();

  const [plan, setPlan] = React.useState<'monthly' | 'yearly'>('monthly');
  const [tab, setTab] = React.useState<'calculator' | 'login' | 'register'>(
    'calculator',
  );

  const [workspaces, _setWorkspaces] = React.useState(0);
  const [storage, _setStorage] = React.useState<number | 'custom'>(0);
  const [customStorage, setCustomStorage] = React.useState(0);

  const setStorage = (st: number | 'custom') => {
    _setStorage((s) => (s === st ? 0 : st));
    setCustomStorage(() => 0);
  };
  const setWorkspaces = (ws: number) =>
    _setWorkspaces((w) => (w === ws ? 0 : ws));

  const pricesData = calculatePrice({
    extraStorage: storage === 'custom' ? customStorage || 0 : storage,
    extraWorkspaces: workspaces,
    subscription: plan,
  });

  const { isLoading, mutate, error } = useMutation(
    (vals: {
      extraStorage: number;
      extraWorkspaces: number;
      subscription: 'monthly' | 'yearly';
    }) => upgradePlan(vals),
    {
      onSuccess: () => {
        refetchUser().then();
        // .finally(() => navigate('/dashboard/plan'));
      },
    },
  );
  const err = (error as any)?.message || '';

  // features list -------------------

  const bigFilesFeatures = [
    {
      name: t('pricing:transfer-size-limit'),
      free: <Text color="primary.500">2 GB</Text>,
      tornado: <Text color="primary.500">{t('pricing:unlimited')}</Text>,
    },
    {
      name: t('pricing:storage'),
      free: <Text>4 GB</Text>,
      tornado: <Text color="primary.500">1 TB</Text>,
    },
    {
      name: 'Workspaces',
      free: <Text color="primary.500">1 Workspace</Text>,
      tornado: <Text color="primary.500">5 Workspaces</Text>,
    },
    {
      name: t('pricing:download-with-no-account'),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: t('pricing:track-downloads'),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];

  const brandFeatures = [
    {
      name: t('pricing:custom-download-page'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: t('pricing:wallpaper-backgrounds'),
      free: (
        <Text color="primary.500">{t('pricing:advertising-(and-art)')}</Text>
      ),
      tornado: <Text color="primary.500">{t('pricing:upload-your-own')}</Text>,
    },
    {
      name: t('pricing:custom-workspace-image'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];

  const secureTransfersFeatures = [
    {
      name: t('pricing:custom-expiration-dates'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: t('pricing:password-protected-transfers'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: t('pricing:data-encryption'),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];

  const moreZoxxo = [
    {
      name: t('pricing:zoxxo-manage-(file-manager)'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: t('pricing:zoxxo-ads-(enhance-your-brand)'),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];
  // ---------------------------------

  return (
    <Layout bgColor="#fafafa">
      <Navbar />
      <Box
        bgColor="primary.100"
        w="full"
        className="flex flex-col"
        mt="calc(-1 * var(--nav-height))"
        pt="var(--nav-height)"
      >
        <Container
          maxW="container.2xl"
          className="flex items-center flex-wrap"
          py="40px"
          pos="relative"
          minH={{ base: '700px', md: '600px', lg: '750px', xl: '900px' }}
        >
          <Stack
            spacing={9}
            flex={1}
            maxW={{ base: 'full', lg: '50%' }}
            minW="min(100%, 500px)"
          >
            <Box
              className="flex flex-col"
              color="primary.500"
              lineHeight={1}
              fontWeight="normal"
            >
              <Heading
                as="h1"
                fontWeight="normal"
                fontSize={{ base: '5xl', xl: '71px' }}
              >
                TORNADO
                <br />
                {t('tornado:go-faster-and-faster')}
              </Heading>
            </Box>
            <Box className="flex flex-col">
              <Text
                color="primary.500"
                fontSize={{ base: 'xl', md: '2xl', xl: '3xl' }}
              >
                {t('tornado:why-should-i-choose-tornado')}
              </Text>
              <Text
                color="gray.600"
                fontSize={{ base: 'xl', md: '2xl', xl: '3xl' }}
                lineHeight={1.1}
                letterSpacing={1}
                mt="3"
              >
                {t('tornado:why-should-i-choose-tornado-paragraph')}
              </Text>
            </Box>
            <Button
              as={GLink}
              to="/register"
              variant="solid"
              mt={3}
              colorScheme="primary"
              alignSelf="flex-start"
              letterSpacing="1.2px"
              fontWeight={500}
              py={{ base: '2', md: '4', lg: '8' }}
              size="lg"
              fontSize={{ base: 'xl', lg: '2xl' }}
            >
              {t('home:register-now-for-free')}
            </Button>
          </Stack>
          <Box
            as={Img}
            src={pointingPerson}
            alt="transfer person"
            w={{ base: '80%', lg: '60%' }}
            aspectRatio={1}
            pos={{ base: 'static', lg: 'absolute' }}
            right={0}
          />
        </Container>
      </Box>
      <Container
        maxW="container.2xl"
        className="flex flex-wrap justify-between"
        my="230px"
        letterSpacing={1.2}
        gap={10}
      >
        <Box
          className="flex flex-col"
          w={{ base: 'full', md: '45%', lg: '55%' }}
        >
          <Text fontWeight={500} fontSize="3xl">
            {plan === 'monthly'
              ? t('tornado:calculate-your-monthly-costs-with-tornado')
              : t('tornado:calculate-your-yearly-costs-with-tornado')}
          </Text>
          <RadioGroup
            as={Stack}
            mt="9"
            maxW="fit-content"
            value={plan}
            onChange={(val: 'monthly' | 'yearly') => setPlan(val)}
          >
            <Radio
              bgColor="primary.100"
              _checked={{
                bgColor: 'primary.500',
                border: '3px solid',
                borderColor: 'primary.200',
              }}
              value="monthly"
              letterSpacing={1.2}
              size="lg"
            >
              {t('pricing:monthly-billing')}
            </Radio>
            <Radio
              bgColor="primary.100"
              _checked={{
                bgColor: 'primary.500',
                border: '3px solid',
                borderColor: 'primary.200',
              }}
              value="yearly"
              size="lg"
              lineHeight={1}
              letterSpacing={1.2}
              alignItems="flex-start"
            >
              {t('pricing:yearly-billing')}
              <br />
              <Text color="primary.500">{t('pricing:save-over-50%')}</Text>
            </Radio>
          </RadioGroup>
          <List mt={8} spacing={2}>
            <ListItem>
              <ListIcon as={CheckIcon} color="primary.500" />
              {t('tornado:unlimited-file-size')}
            </ListItem>
            <ListItem>
              <ListIcon as={CheckIcon} color="primary.500" />1 TB&nbsp;
              {t('common:storage')}
            </ListItem>
            <ListItem>
              <ListIcon as={CheckIcon} color="primary.500" />
              5&nbsp;{t('common:workspaces')}
            </ListItem>
            <ListItem>
              <Button
                as="a"
                href="#features"
                colorScheme="primary"
                variant="link"
                fontWeight="normal"
                ml={5}
              >
                {t('tornado:see-all-features')}
              </Button>
            </ListItem>
          </List>
          <Box className="flex flex-col" mt={7}>
            <Text fontSize="27px">
              {t('tornado:how-much-extra-storage-do-you-need')}
            </Text>
            <Box className="flex flex-wrap items-center" gap={4} mt={2}>
              {[2, 4, 8, 16, 'custom'].map((st) => (
                <Button
                  variant="outline"
                  bgColor={
                    st === storage
                      ? 'primary.50 !important'
                      : 'gray.50 !important'
                  }
                  borderColor={st === storage ? 'primary.300' : 'gray.300'}
                  fontSize={{ base: 'xl', lg: '2xl', xl: '3xl' }}
                  fontWeight="normal"
                  color={st === storage ? 'primary.500' : 'initial'}
                  p={{ base: 4, lg: 6, xl: 7 }}
                  onClick={() => setStorage(st as number | 'custom')}
                >
                  <If condition={st === 'custom'}>
                    <Then>
                      <Input
                        type="number"
                        variant="unstyled"
                        rounded="none !important"
                        size={{ base: 'sm', lg: 'lg' }}
                        fontSize="3xl"
                        borderBottom="2px solid"
                        maxW="50px"
                        value={customStorage || ''}
                        onChange={(e) =>
                          setCustomStorage(Number(e.target.value) > 100 ? 100 : Number(e.target.value))
                        }
                      />
                      &nbsp;TB
                    </Then>
                    <Else>{st} TB</Else>
                  </If>
                </Button>
              ))}
            </Box>
          </Box>
          <Box className="flex flex-col" mt={7}>
            <Text fontSize="27px">
              {t('tornado:how-many-extra-workspaces-do-you-need')}
            </Text>
            <Box className="flex flex-wrap items-center" gap={4} mt={2}>
              {[3, 5, 10, 20, 50].map((ws) => (
                <Button
                  variant="outline"
                  bgColor={
                    ws === workspaces
                      ? 'primary.50 !important'
                      : 'gray.50 !important'
                  }
                  borderColor={ws === workspaces ? 'primary.300' : 'gray.300'}
                  fontSize={{ base: 'xl', lg: '2xl', xl: '3xl' }}
                  fontWeight="normal"
                  color={ws === workspaces ? 'primary.500' : 'initial'}
                  p={{ base: 4, lg: 6, xl: 7 }}
                  onClick={() => setWorkspaces(ws as number)}
                >
                  {ws}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          className="flex flex-col"
          maxW={{ base: '600px', lg: '480px' }}
          minW="200px"
          w={{ base: 'full', md: '45%', lg: '40%' }}
          pos={{ base: 'static', lg: 'sticky' }}
          top="var(--nav-height)" // navbar height
        >
          <Switch>
            <Case condition={tab === 'login'}>
              <LoginCard
                onSuccess={() => {
                  setTab('calculator');
                  mutate({
                    extraStorage:
                      storage === 'custom' ? customStorage || 0 : storage,
                    extraWorkspaces: workspaces,
                    subscription: plan,
                  });
                }}
                setTab={setTab}
              />
            </Case>
            <Case condition={tab === 'register'}>
              <RegisterCard onSuccess={() => setTab('login')} setTab={setTab} />
            </Case>
            <Default>
              <Card variant="outline" shadow="md">
                <CardHeader
                  px={0}
                  pb={1}
                  borderBottom="1.5px solid"
                  borderColor="gray.200"
                >
                  <Text px={5} fontSize="3xl">
                    {t('tornado:your-new-plan')}
                  </Text>
                </CardHeader>
                <CardBody className="flex flex-col">
                  <Text className="flex items-center justify-between">
                    <span>TORNADO ({t(`common:${plan}`)})</span>
                    <span>{pricesData.basePrice.toFixed(2)} USD</span>
                  </Text>
                  <Text color="gray.500">
                    {t('tornado:unlimited-file-size')}
                  </Text>
                  <Text color="gray.500">1 TB&nbsp;{t('common:storage')}</Text>
                  <Text color="gray.500">5&nbsp;{t('common:workspaces')}</Text>
                  <Text className="flex items-center justify-between" mt={5}>
                    <span>{t('tornado:extra-storage')}</span>
                    <span>{pricesData.extraStoragePrice.toFixed(2)} USD</span>
                  </Text>
                  <Text color="gray.500">
                    {storage === 'custom' ? customStorage : storage} TB&nbsp;
                    {t('tornado:extra-storage')}
                  </Text>
                  <Text className="flex items-center justify-between" mt={5}>
                    <span>{t('tornado:extra-workspaces')}</span>
                    <span>
                      {pricesData.extraWorkspacesPrice.toFixed(2)} USD
                    </span>
                  </Text>
                  <Text color="gray.500">
                    {workspaces}&nbsp;{t('common:workspaces')}
                  </Text>
                  <Text
                    className="flex items-center justify-between"
                    mt={5}
                    display={
                      user && !user?.subscription?.isEligibleForProratedDiscount
                        ? 'none'
                        : 'flex'
                    }
                  >
                    <span>{t('tornado:prorated-discount')}</span>
                    <span>-{pricesData.proratedDiscount.toFixed(2)} USD</span>
                  </Text>
                  <Text className="flex items-center justify-between" mt={5}>
                    <span>{t('tornado:reverse-charge')}&nbsp;(0%)</span>
                    <span>0.00 USD</span>
                  </Text>
                  <Text
                    className="flex items-center justify-between"
                    fontSize="28px"
                    borderTop="1.5px solid"
                    borderBottom="1.5px solid"
                    borderColor="gray.300"
                    my={5}
                    py={5}
                  >
                    <span>{t('tornado:total')}</span>
                    <span>
                      {user && !user.subscription?.isEligibleForProratedDiscount
                        ? (
                          pricesData.total
                        ).toFixed(2)
                        : pricesData.total.toFixed(2)}
                      &nbsp;USD
                    </span>
                  </Text>
                  <UnorderedList color="gray.500" spacing={2}>
                    <ListItem
                      display={
                        user &&
                          !user?.subscription?.isEligibleForProratedDiscount
                          ? 'none'
                          : 'flex'
                      }
                    >
                      {t('tornado:youll-pay-1099-usd-now-line').replace(
                        '1099',
                        pricesData.total.toFixed(2),
                      )}
                    </ListItem>
                    <ListItem>
                      {t('tornado:your-plan-is-billed-paragraph')
                        .replace(
                          '1099',
                          (
                            pricesData.total
                          ).toFixed(2),
                        )
                        .replace('monatlich', t(`common:${plan}`))
                        .replace('monthly', t(`common:${plan}`))}
                    </ListItem>
                    <ListItem>{t('tornado:you-can-cancel-any-time')}</ListItem>
                  </UnorderedList>
                  <Error message={err} />
                  <Button
                    variant="solid"
                    colorScheme="primary"
                    mt={2}
                    isLoading={isLoading}
                    onClick={() =>
                      user
                        ? mutate({
                          extraStorage:
                            storage === 'custom'
                              ? customStorage || 0
                              : storage,
                          extraWorkspaces: workspaces,
                          subscription: plan,
                        })
                        : setTab('login')
                    }
                  >
                    {t('tornado:continue-with-this-plan')}
                  </Button>
                </CardBody>
              </Card>
            </Default>
          </Switch>
        </Box>
        <Box
          className="flex flex-col"
          w={{ base: 'full', md: '45%', lg: '55%' }}
          overflowX="auto"
        >
          <Box minW="400px" w="full" className="flex flex-col">
            <Text fontWeight={500} fontSize="2xl" id="features">
              {t('pricing:send-big-files')}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {bigFilesFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
              {t('pricing:show-off-your-brand')}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {brandFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
              {t('pricing:secure-your-transfers')}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {secureTransfersFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
              {t('pricing:experience-more-zoxxo')}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {moreZoxxo.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box bgColor="primary.500">
        <Container maxW="container.2xl" textAlign="center" py="20">
          <Text
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            color="white"
            lineHeight={1.2}
          >
            {t('tornado:want-to-save-more-money')}
            <br />
            {t('tornado:go-for-yearly-plan-and-save-over')}
          </Text>
        </Container>
      </Box>
      <Footer />
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO />;
