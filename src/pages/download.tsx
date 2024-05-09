import React from 'react';
import { Link as GLink, HeadFC } from 'gatsby';
import { Box, Button, Img, Stack, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// import { createWriteStream } from 'streamsaver';

import Layout from '../components/Layout';
import coverImage from '../static/cover-image.png';
import logo from '../static/zoxxo_CLR.png';
import {
  getCampaign,
  getDownloadLinks,
  getUploadInfo,
  incrementClicks,
} from '../api';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import moment from 'moment';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { getTextColorForBackground, isBrowser, removeHash } from '../utils';
import { SEO } from '../components/SEO';
import useAuth from '../hooks/useAuth';
import EmailUserModal from '../components/EmailUserModal';

// Function to download a file from a URL with a specified filename
const downloadFile = async (url: string, filename: string) => {
  // do not run if not in browser
  if (!isBrowser()) return;
  const { createWriteStream } = await import('streamsaver');
  // Create a writable stream for the file
  const writableStream = createWriteStream(filename);

  // Fetch the file data from the URL and pipe it to the writable stream
  fetch(url)
    .then((response) => response?.body?.pipeTo(writableStream))
    .then(() => {
      console.log(`File ${filename} downloaded successfully`);
    })
    .catch((error) => {
      console.error(`Error downloading ${filename}:`, error);
    });
};

export default function Download() {
  const { t } = useTranslation(['common', 'uploader']);
  const { user } = useAuth();
  const [downloadId, setDownloadId] = React.useState('');
  const { isLoading, isFetching, data, error } = useQuery(
    ['upload', downloadId],
    () => getUploadInfo(downloadId),
    {
      enabled: Boolean(downloadId),
    },
  );
  const err = (error as any)?.message || '';

  const [isGettingLinks, setGettingLinks] = React.useState(false);
  const [downloadLinksError, setDownloadLinksError] = React.useState('');

  const [previewCreative, setPreviewCreative] = React.useState<{
    url: string;
    image: string;
  }>();

  const beginDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data?.name || 'zoxxo'}.zip`; // Replace with the desired file name
    document.body.appendChild(link);
    // Trigger the download
    link.click();
  };

  const { data: campaign } = useQuery(
    ['campaign'],
    () => getCampaign('download-screen'),
    {
      enabled: !(user || data?.user)?.subscription?.type, // don't show ad on files uploaded by tornado user
    },
  );
  const creativeNo = Number.parseInt((Math.random() * 10).toString()) % 2;
  const creative =
    previewCreative ||
    (creativeNo && campaign?.isABTesting
      ? campaign.creativeABTesting
      : campaign?.creative);

  const { mutate } = useMutation(() =>
    incrementClicks(campaign?._id || '', campaign?.updateToken || ''),
  );

  React.useEffect(() => {
    // if preview is available in url, show it
    if (isBrowser()) {
      const searchParams = new URLSearchParams(window.location.search);
      const preview = searchParams.get('preview-creative');
      if (preview) {
        setPreviewCreative(JSON.parse(preview));
      }
    }
    if (isBrowser()) {
      const q = new URLSearchParams(window.location.search);
      setDownloadId(q.get('uploadId') || '');
    }
  }, [setDownloadId]);
  return (
    <Layout>
      <Box className="flex flex-wrap" h="100vh">
        <Box
          className="flex flex-col"
          w={{ base: 'full', lg: '50%' }}
          bgColor="gray.50"
          py="76px"
          px="2.5"
        >
          <Box
            className="flex flex-col justify-center items-center"
            w="full"
            maxW="95%"
            m="auto"
            h="full"
          >
            <Box as={GLink} to="/" w="70px">
              <Box as={Img} src={logo} alt="zoxxo logo" w="full" />
            </Box>
            <Text fontSize="44px" textAlign="center" mt="74px">
              {t('common:download-your-files')}
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
            <Stack w="full" mt="12" spacing={4} mb="8">
              <Switch>
                <Case condition={isLoading}>
                  <Loader />
                </Case>
                <Case condition={!isLoading && !isFetching && err}>
                  <Error message={err} />
                </Case>
                <Case condition={typeof data !== 'undefined'}>
                  {data?.files?.map((file) => (
                    <Box
                      bgColor="white"
                      className="flex items-start"
                      p={3}
                      w="full"
                      gap={4}
                      shadow="md"
                      rounded="xl"
                      key={file.filename}
                    >
                      <Box
                        rounded="xl"
                        bgColor={data?.color}
                        aspectRatio={1}
                        minW="58px"
                      />
                      <Box
                        className="flex flex-col"
                        w="calc(100% - 58px)"
                        pr={2}
                      >
                        <Text
                          fontSize="xl"
                          maxW="100%"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          overflow="hidden"
                        >
                          {removeHash(file.filename)}
                        </Text>
                        <Text fontSize="lg" color="gray.500">
                          {t('common:uploaded')}:&nbsp;
                          {moment(data?.createdAt).format('DD.MM.YYYY')}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </Case>
              </Switch>
            </Stack>
            <When condition={Boolean(data) && data?.files.length}>
              <Error message={downloadLinksError || ''} />
              <Button
                variant="solid"
                bgColor={`${data?.color || 'primary.500'} !important`}
                mt="auto"
                mx="auto"
                color={getTextColorForBackground(data?.color || '#f21a5d')}
                isLoading={isGettingLinks}
                onClick={() => {
                  setGettingLinks(true);
                  getDownloadLinks(downloadId)
                    .then((d) => {
                      beginDownload(d.link);
                      setDownloadLinksError('');
                    })
                    .catch((e) => setDownloadLinksError(e.message))
                    .finally(() => setGettingLinks(false));
                }}
              >
                Download
              </Button>
              <When condition={data?.user?.subscription?.type}>
                <EmailUserModal uploadId={data?._id || ''} />
              </When>
            </When>
          </Box>
        </Box>
        <If condition={Boolean(data?.coverImage)}>
          <Then>
            <Box
              bgImage={`url(${process.env.GATSBY_BACKEND_URL}/uploads/${data?._id}/cover-image)`}
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
