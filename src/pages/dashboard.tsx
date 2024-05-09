import React from 'react';
import { Link, navigate } from 'gatsby';
import { Router, RouteComponentProps } from '@reach/router';
import { Box, Card, CardBody, Flex, Img, Text } from '@chakra-ui/react';
import { Else, If, Then } from 'react-if';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Sidebar from '../components/Dashboard/Sidebar';
import logo from '../static/zoxxo_CLR.png';
import Account from '../components/Dashboard/Account';
import Topbar from '../components/Dashboard/Topbar';
import Preferences from '../components/Dashboard/Preferences';
import Communications from '../components/Dashboard/Communications';
import PlanAndBilling from '../components/Dashboard/PlanAndBilling';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';
import { getRelativeSize } from '../utils';
import IUpload from '../interfaces/IUpload';
import UploadFiles from '../components/Dashboard/Manage/UploadFiles';
import i18n from '../i18n';

function Index(props: RouteComponentProps) {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title="Dashboard"
        description={t('dashboard-description-line')}
        actions={
          <Box order={{ base: 2, md: 3 }} ml="auto">
            <UploadFiles workspaceId={user?.workspaces[0]?._id} />
          </Box>
        }
      />
      <Flex flexWrap="wrap" w="full" mt="14" gap={5} overflowY="auto">
        <Card
          as={Link}
          to={`/manage/${user?.workspaces[0]?._id}`}
          shadow="md"
          w="full"
          maxW={{ base: '200px', lg: '282px' }}
          aspectRatio={282 / 326}
        >
          <CardBody
            className="flex flex-col items-center justify-center"
            gap={2}
            bgColor="lavender-blue.400"
            rounded="lg"
          >
            <Box as={Img} src={logo} alt="zoxxo logo" maxW="84px" />
            <Text textTransform="uppercase" fontSize="3xl" color="gray.600">
              Manage
            </Text>
          </CardBody>
        </Card>
        <Card
          as={Link}
          to="/ads"
          shadow="md"
          w="full"
          maxW={{ base: '200px', lg: '282px' }}
          aspectRatio={282 / 326}
        >
          <CardBody
            className="flex flex-col items-center justify-center"
            gap={2}
            bgColor="powder-blue.400"
            rounded="lg"
          >
            <Box as={Img} src={logo} alt="zoxxo logo" maxW="84px" />
            <Text textTransform="uppercase" fontSize="3xl" color="gray.600">
              Ads
            </Text>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { user, isGettingLoggedIn, refetchUser } = useAuth();

  let totalSizeConsumed = 0;
  if (user) {
    if (!user.workspaces) return;
    const allUploads = user.workspaces.reduce(
      (acc = [], curr) => [...acc, ...(curr.uploads as IUpload[])],
      [] as IUpload[],
    );
    totalSizeConsumed = allUploads.reduce(
      (sum = 0, curr) => sum + curr.sizeInBytes,
      0,
    );
  }

  const links = [
    { name: t('dashboard'), to: '/dashboard' },
    { name: t('account'), to: '/dashboard/account' },
    { name: t('plan-and-billing'), to: '/dashboard/plan' },
    { name: t('preferences'), to: '/dashboard/preferences' },
    { name: t('communications'), to: '/dashboard/communications' },
  ];

  React.useEffect(() => {
    if (!user && !isGettingLoggedIn) navigate('/');
  }, [user, isGettingLoggedIn]);

  React.useEffect(() => {
    refetchUser();
  }, []);

  return (
    <Elements stripe={stripePromise} options={{ locale: (i18n.language || 'en') as 'en' | 'de' }}>
      <Layout>
        <Box className="flex flex-col" h="100vh">
          <If condition={isGettingLoggedIn}>
            <Then>
              <Box className="flex flex-col" m="auto">
                <Text color="primary.500" fontSize="xl">
                  zoxxo
                </Text>
                <Loader containerProps={{ m: 'auto' }} />
              </Box>
            </Then>
            <Else>
              <DashboardNavbar section="box" />
              <Box className="flex" h="full" overflowY="auto">
                <Sidebar
                  title={t('general-settings')}
                  links={links}
                  storage={{
                    used: getRelativeSize(totalSizeConsumed),
                    total: getRelativeSize(user?.storageSizeInBytes || 0),
                    usedPercent: user
                      ? (totalSizeConsumed * 100) / user?.storageSizeInBytes
                      : 0,
                  }}
                />
                <Box
                  className="flex flex-col"
                  h="full"
                  w="full"
                  px={5}
                  letterSpacing="1.2px"
                  id="dashboard-content"
                >
                  <Box as={Router} id="router" h="full" basepath="dashboard">
                    <Index path="/" />
                    <Account path="/account" />
                    <PlanAndBilling path="/plan" />
                    <Preferences path="/preferences" />
                    <Communications path="/communications" />
                  </Box>
                </Box>
              </Box>
            </Else>
          </If>
        </Box>
      </Layout>
    </Elements>
  );
}
