import React from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';
import { Box, extendTheme, Text, ThemeProvider } from '@chakra-ui/react';
import { If, Then, Else } from 'react-if';

import Layout from '../components/Layout';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Sidebar from '../components/Dashboard/Sidebar';
import Workspace from '../components/Dashboard/Manage/Workspace';
import theme from '../@chakra-ui/gatsby-plugin/theme';
import CreateWorkspaceModal from '../components/Dashboard/Manage/NewWorkspaceModal';
import useAuth from '../hooks/useAuth';
import { getRelativeSize, isBrowser } from '../utils';
import IUpload from '../interfaces/IUpload';
import Loader from '../components/Loader';

const manageTheme = extendTheme({
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      50: '#f5f4f8',
      100: '#ebeaf2',
      200: '#d7d4e4',
      300: '#c2bfd7',
      400: '#aea9c9',
      500: '#9A94BC',
      600: '#7b7696',
      700: '#5c5971',
      800: '#3e3b4b',
      900: '#1f1e26',
    },
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

const DefaultRouteRedirect = (props: RouteComponentProps & { to: string }) => {
  React.useEffect(() => {
    // when in browser navigate
    if (isBrowser()) navigate(props.to);
  }, []);
  return <></>;
};

export default function Manage() {
  try {
    const { user, isGettingLoggedIn, refetchUser } = useAuth();
    const [name, setName] = React.useState('');

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

    React.useEffect(() => {
      if (!user && !isGettingLoggedIn) navigate('/');
    }, [user, isGettingLoggedIn]);

    React.useEffect(() => {
      refetchUser();
    }, []);
    return (
      <ThemeProvider theme={manageTheme}>
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
                <DashboardNavbar section="manage" />
                <Box className="flex" h="full" overflowY="auto">
                  <Sidebar
                    title="Workspaces"
                    titleBadge={<CreateWorkspaceModal />}
                    links={
                      user?.workspaces?.map((ws, index) => ({
                        name: ws.name,
                        to: `/manage/${ws._id}`,
                        badge: ws.uploads?.length.toString() || '',
                      })) || []
                    }
                    storage={{
                      used: getRelativeSize(totalSizeConsumed),
                      total: getRelativeSize(user?.storageSizeInBytes || 0),
                      usedPercent: user
                        ? (totalSizeConsumed * 100) / user?.storageSizeInBytes
                        : 0,
                    }}
                    searchInputProps={{
                      type: 'text',
                      value: name,
                      onChange: (e) => setName(e.target.value)
                    }}
                  />
                  <Box
                    className="flex flex-col"
                    h="full"
                    w="full"
                    px={5}
                    letterSpacing="1.2px"
                    id="manage-content"
                  >
                    <Box
                      as={Router}
                      display="flex"
                      flexDir="column"
                      id="router"
                      h="full"
                    >
                      <DefaultRouteRedirect
                        path="/manage"
                        to={`/manage/${user?.workspaces[0] ? user?.workspaces[0]?._id : 'default'}`}
                      />
                      <Workspace path="/manage/:id" uploadName={name} />
                    </Box>
                  </Box>
                </Box>
              </Else>
            </If>
          </Box>
        </Layout>
      </ThemeProvider>
    );
  } catch (e) {
    console.log(e);
  }
}
