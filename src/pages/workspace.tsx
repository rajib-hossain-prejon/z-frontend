import React from 'react';
import { HeadFC } from 'gatsby';
import { Avatar, Box, Button, Flex, Img, Stack, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// import { createWriteStream } from 'streamsaver';

import Layout from '../components/Layout';
import coverImage from '../static/cover-image.png';
import {
  getCampaign,
  getDownloadLinks,
  getWorkspaceInfo,
  incrementClicks,
} from '../api';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { getTextColorForBackground, isBrowser } from '../utils';
import { SEO } from '../components/SEO';
import useAuth from '../hooks/useAuth';
import EmailUserModal from '../components/EmailUserModal';

export default function Download() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [workspaceId, setDownloadId] = React.useState('');
  const { isLoading, isFetching, data, error } = useQuery(
    ['view-workspace', workspaceId],
    () => getWorkspaceInfo(workspaceId),
    {
      enabled: Boolean(workspaceId),
    },
  );
  const err = (error as any)?.message || '';

  const [uploadId, setUploadId] = React.useState('');
  const [isGettingLinks, setGettingLinks] = React.useState(false);
  const [downloadLinksError, setDownloadLinksError] = React.useState('');

  const { data: campaign } = useQuery(
    ['campaign'],
    () => getCampaign('download-screen'),
    {
      enabled: !(user || data?.user)?.subscription?.type, // don't show ad on files uploaded by tornado user
    },
  );
  const creativeNo = Number.parseInt((Math.random() * 10).toString()) % 2;
  const creative =
    creativeNo && campaign?.isABTesting
      ? campaign.creativeABTesting
      : campaign?.creative;

  const { mutate } = useMutation(() =>
    incrementClicks(campaign?._id || '', campaign?.updateToken || ''),
  );

  const beginDownload = (url: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename || 'zoxxo'}.zip`; // Replace with the desired file name
    document.body.appendChild(link);
    // Trigger the download
    link.click();
  };
  React.useEffect(() => {
    if (isBrowser()) {
      const q = new URLSearchParams(window.location.search);
      setDownloadId(q.get('workspaceId') || '');
    }
  }, [setDownloadId]);
  return (
    <Layout>
      <Box className="flex flex-wrap" h="100vh">
        <Box
          className="flex flex-col"
          w={{ base: 'full', lg: '50%' }}
          bgColor="gray.50"
          py="5vh"
          px="2.5"
        >
          <Box
            className="flex flex-col justify-center items-center"
            w="full"
            maxW="95%"
            m="auto"
            h="full"
          >
            <Box>
              <Avatar
                name={data?.user?.fullName}
                bgColor="gray.300"
                size="lg"
                src={
                  process.env.GATSBY_BACKEND_URL && data?.user?.avatar
                    ? `${process.env.GATSBY_BACKEND_URL}/uploads/images/${data?.user?.avatar}`
                    : 'https://www.dummyimage.com/100x100/2B2B2B/fff'
                }
              />
            </Box>
            <Text
              fontSize={{ base: 'lg', md: 'xl', xl: '4xl' }}
              textAlign="center"
              mt="4vh"
            >
              {t('download-your-files')}
            </Text>
            <Text
              color="gray.500"
              textAlign="center"
              fontSize={{ base: 'md', md: 'lg', xl: '2xl' }}
              mx="auto"
              maxW="360px"
            >
              {t('uploader:deliver-your-data-fast-line')}
            </Text>
            <Stack w="full" mt="12" spacing={4} mb="8">
              <Error message={downloadLinksError || ''} />
              <Switch>
                <Case condition={isLoading}>
                  <Loader />
                </Case>
                <Case condition={!isLoading && !isFetching && err}>
                  <Error message={err} />
                </Case>
                <Case condition={typeof data !== 'undefined'}>
                  <Flex align="center" justify="center" gap={6} flexWrap="wrap">
                    {data?.uploads?.map((upl) => (
                      <Box
                        bgColor="white"
                        className="flex flex-col"
                        w={{
                          base: '80%',
                          md: 'calc(50% - 32px)',
                          lg: '44%',
                          xl: '30%',
                        }}
                        gap={4}
                        shadow="md"
                        rounded="xl"
                        key={upl.name}
                      >
                        <Box
                          roundedTop="xl"
                          bgColor={upl.color || 'primary.500'}
                          aspectRatio={1}
                          minW="58px"
                          className="flex"
                        >
                          <Text
                            color={getTextColorForBackground(upl.color)}
                            fontWeight="semibold"
                            fontSize="xl"
                            textAlign="center"
                            m="auto"
                            p={1}
                          >
                            {upl.name}
                          </Text>
                        </Box>
                        <Button
                          variant="link"
                          color={upl.color}
                          textDecor="none !important"
                          alignSelf="center"
                          mx="auto"
                          mb={4}
                          isLoading={isGettingLinks && upl._id === uploadId}
                          onClick={() => {
                            setGettingLinks(true);
                            setUploadId(upl._id);
                            getDownloadLinks(upl._id)
                              .then((d) => {
                                beginDownload(d.link, upl.name);
                                setDownloadLinksError('');
                              })
                              .catch((e) => setDownloadLinksError(e.message))
                              .finally(() => {
                                setGettingLinks(false);
                                setUploadId('');
                              });
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    ))}
                  </Flex>
                </Case>
              </Switch>
            </Stack>
            <When condition={data?.user?.subscription?.type && data?.uploads?.length}>
              <EmailUserModal uploadId={data?.uploads?.length ? data.uploads[0]?._id : ''} />
            </When>
          </Box>
        </Box>
        <If condition={Boolean(data?.coverImage)}>
          <Then>
            <Box
              bgImage={`url(${process.env.GATSBY_BACKEND_URL}/uploads/images/${data?.coverImage})`}
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPos="center"
              w={{ base: 'full', lg: '50%' }}
              minH="50vh"
              className="flex items-center justify-center"
              pos="relative"
              p={4}
            ></Box>
          </Then>
          <Else>
            <Box
              bgImage="linear-gradient(-135deg,#cdf7f6 0.00%,#9a94bc 100.00%)"
              w={{ base: 'full', lg: '50%' }}
              minH="50vh"
              className="flex items-center justify-center"
              pos="relative"
            >
              <If
                condition={Boolean(
                  creative && !(user || data?.user)?.subscription?.type,
                )}
              >
                <Then>
                  <Box
                    as="a"
                    href={creative?.url || ''}
                    target="_blank"
                    w="full"
                    h="full"
                    bgImage={`url(${creative?.image})`}
                    bgSize="cover"
                    bgPos="center"
                    onClick={() => {
                      mutate();
                    }}
                  />
                </Then>
                <Else>
                  <Box
                    as={Img}
                    src={coverImage}
                    alt="cover image"
                    w={{ base: '75%', sm: '55%', md: '60%', lg: '75%' }}
                    m="auto"
                  />
                </Else>
              </If>
            </Box>
          </Else>
        </If>
      </Box>
    </Layout>
  );
}

export const HEAD: HeadFC = () => (
  // add streamsaver package so that it can be used for downloads
  <SEO>
    <script src="https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js"></script>
  </SEO>
);
