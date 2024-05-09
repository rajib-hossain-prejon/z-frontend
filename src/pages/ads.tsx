import React from 'react';
import { Router } from '@reach/router';
import { navigate } from 'gatsby';
import { Box, extendTheme, Text, ThemeProvider } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Else, If, Then } from 'react-if';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Layout from '../components/Layout';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Sidebar from '../components/Dashboard/Sidebar';
import theme from '../@chakra-ui/gatsby-plugin/theme';
import AdsDashboard from '../components/Dashboard/Ads';
import NewCampaign from '../components/Dashboard/Ads/NewCampaign';
import useAuth from '../hooks/useAuth';
import { getLoggedIn } from '../api/auth';
import Loader from '../components/Loader';
import { getCampaigns } from '../api/user';
import moment from 'moment';
import ICampaign from '../interfaces/ICampaign';
import useAds from '../hooks/useAds';
import PayCampaign from '../components/Dashboard/Ads/PayCampaign';
import { useTranslation } from 'react-i18next';

const manageTheme = extendTheme({
  ...theme,
  colors: {
    ...theme.colors,
    primary: theme.colors['powder-blue'],
    secondary: {
      50: '#fee8ef',
      100: '#fcd1df',
      200: '#faa3be',
      300: '#f7769e',
      400: '#f5487d',
      500: '#f21a5d', // base color value
      600: '#c2154a',
      700: '#911038',
      800: '#610a25',
      900: '#300513',
    },
  },
});

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

export default function Ads() {
  const { t } = useTranslation('ads');
  const { allCampaigns, setAllCampaigns } = useAds();
  const { user, isGettingLoggedIn, refetchUser } = useAuth();

  const { isLoading, data } = useQuery(['campaigns'], getCampaigns);

  const today = moment().format('YYYY-MM-DD');
  const currentCampaigns =
    (allCampaigns || []).filter((c) => !moment(c.endDate).isBefore(today)) ||
    [];

  const links = [
    { name: t('dashboard:dashboard'), to: '/ads' },
    {
      name: t('current-campaigns'),
      to: '/ads/current-campaigns',
      uploads: currentCampaigns.length,
    },
    {
      name: t('past-campaigns'),
      to: '/ads/past-campaigns',
      uploads: allCampaigns.length - currentCampaigns.length,
    },
  ];

  React.useEffect(() => {
    if (data) setAllCampaigns(data);
  }, [data]);

  React.useEffect(() => {
    if (!user && !isGettingLoggedIn) navigate('/');
  }, [user, isGettingLoggedIn]);

  React.useEffect(() => {
    refetchUser();
  }, []);
  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={manageTheme}>
        <Layout>
          <Box className="flex flex-col" h="100vh">
            <If condition={isGettingLoggedIn || isLoading}>
              <Then>
                <Box className="flex flex-col" m="auto">
                  <Text color="primary.500" fontSize="xl">
                    zoxxo
                  </Text>
                  <Loader containerProps={{ m: 'auto' }} />
                </Box>
              </Then>
              <Else>
                <DashboardNavbar section="ads" />
                <Box className="flex" h="full" overflowY="auto">
                  <Sidebar
                    title="Advertisement"
                    links={links.map((ws, index) => ({
                      name: ws.name,
                      to: ws.to as string,
                      badge: ws.uploads?.toString() || '',
                    }))}
                  />
                  <Box
                    className="flex flex-col"
                    h="full"
                    w="full"
                    px={5}
                    letterSpacing="1.2px"
                    id="ads-content"
                  >
                    <Box
                      as={Router}
                      display="flex"
                      flexDir="column"
                      id="router"
                      h="full"
                    >
                      <NewCampaign path="/ads/new-campaign" />
                      <PayCampaign path="/ads/campaigns/:id/pay" />
                      {/* Keep these in last for them to work */}
                      <AdsDashboard path="/ads/:status" />
                      <AdsDashboard path="/ads" />
                    </Box>
                  </Box>
                </Box>
              </Else>
            </If>
          </Box>
        </Layout>
      </ThemeProvider>
    </Elements>
  );
}
