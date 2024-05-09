import React, { FormEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Case, Default, Else, If, Switch, Then, When } from 'react-if';
import { CloseIcon, CopyIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import useHeroSectionStore from '../../hooks/useHeroSectionStore';
import UploadButton from './UploadButton';
import coverImage from '../../static/cover-image.png';
import greetingPerson from '../../static/greetingPerson.png';
import SvgDelete from '../icons/SvgDelete';
import { copyTextToClipboard, getRelativeSize, isBrowser } from '../../utils';
import FilesModal from '../FilesModal';
import {
  getCampaign,
  getUploadLinks,
  incrementClicks,
  verifyUploadCompletion,
} from '../../api';
import useAuth from '../../hooks/useAuth';
import Error from '../Error';

let source = axios.CancelToken.source(); // use for canceling on going request on unmount

const Hero = React.forwardRef<React.PropsWithRef<HTMLDivElement>>(
  function HeroSection(props, ref) {
    const { t } = useTranslation(['translation', 'uploader']);
    const { user } = useAuth();
    const {
      files,
      isSeeMore,
      shareVia,
      addFiles,
      removeFile,
      toggleSeeMore,
      setShareVia,
      reset,
    } = useHeroSectionStore();

    const [formData, setFormData] = React.useState({ email: '', title: '' });
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isUploaded, setIsUploaded] = React.useState(false);
    const [downloadLink, setDownloadLink] = React.useState('');
    const [uploadErr, setUploadErr] = React.useState('');

    const [previewCreative, setPreviewCreative] = React.useState<{
      url: string;
      image: string;
    }>();

    const upload = async () => {
      try {
        source = axios.CancelToken.source();
        setUploadErr('');
        setIsUploading(() => true);
        const {
          uploadUrls: urls,
          upload,
          emailToken,
        } = await getUploadLinks(files);
        const totalBytes = files.reduce<number>(
          (acc = 0, curr) => acc + curr.size,
          0,
        );
        const individualUploaded = Array(files.length).fill(0);
        const calcPercent = () =>
          (individualUploaded.reduce((sum, curr) => sum + curr, 0) * 100) /
          totalBytes;
        for (let i = 0; i < urls.length; i += 1) {
          try {
            await axios.put(urls[i], files[i], {
              headers: {
                'Content-Type': files[i].type,
              },
              cancelToken: source.token,
              // handle upload progress
              onUploadProgress: (event) => {
                // maintain uploaded size for every file
                individualUploaded[i] = event.loaded;
                const percent = calcPercent();
                // set upload progress
                setUploadProgress(() => percent);
                // handle completion
                if (percent >= 100) {
                  // send email
                  verifyUploadCompletion(
                    upload._id,
                    shareVia === 'email'
                      ? {
                        ...formData,
                        emailToken,
                      }
                      : undefined,
                  )
                    .then(() => {
                      setIsUploaded(() => true);
                      setIsUploading(() => false);
                      setDownloadLink(
                        () =>
                          `${isBrowser() ? window.location.href : ''
                          }download?uploadId=${upload._id}`,
                      );
                    })
                    .catch((e) => {
                      setUploadErr(e?.message || 'Server Error' + '.');
                    });
                }
              },
            });
          } catch (e: any) {
            setUploadErr(e?.message || 'Server Error' + '.');
          }
        }
      } catch (e: any) {
        setUploadErr(e?.message || 'Server Error');
      }
    };

    const handleAddFiles = (fs: File[]) => {
      const TWO_GB_LIMIT = 2 * 1000 * 1000 * 1000;
      const FOUR_GB_LIMIT = 4 * 1000 * 1000 * 1000;
      let sizeSum = 0;
      [...files, ...fs].forEach((f) => {
        sizeSum += f.size;
      });
      if (!user && sizeSum > TWO_GB_LIMIT) return;
      if (!user?.subscription?.type && sizeSum > TWO_GB_LIMIT) return;
      addFiles(fs);
    };

    const { data: campaign } = useQuery(
      ['campaign'],
      () => getCampaign('upload-screen'),
      {
        enabled: !user?.subscription?.type, // don't show ad to tornado user
      },
    );
    const { current: creativeNo } = React.useRef(
      Number.parseInt((Math.random() * 10).toString()) % 2,
    );
    const creative =
      previewCreative ||
      (creativeNo && campaign?.isABTesting
        ? campaign.creativeABTesting
        : campaign?.creative);

    const { mutate } = useMutation(() =>
      incrementClicks(campaign?._id || '', campaign?.updateToken || ''),
    );

    React.useEffect(() => {
      // when files change, delete error message
      setUploadErr('');
      // when files become empty, reset the state
      if (files.length > 0) return;
      setUploadErr('');
      setDownloadLink('');
      setIsUploaded(false);
      setIsUploading(false);
      setUploadProgress(0);
      setFormData({ email: '', title: '' });
      source.cancel(); // cancel on going api request
    }, [files]);

    React.useEffect(() => {
      // if preview is available in url, show it
      if (isBrowser()) {
        const searchParams = new URLSearchParams(window.location.search);
        const preview = searchParams.get('preview-creative');
        if (preview) {
          setPreviewCreative(JSON.parse(preview));
        }
      }
      // reset all settings on unmount
      return () => {
        reset();
        source.cancel();
      };
    }, []);

    return (
      <Flex
        as="section"
        flexWrap="wrap"
        justify="center"
        w="full"
        position={{ base: 'static', lg: 'fixed' }}
        mt={{ base: 'calc(-1 * var(--nav-height))', lg: '0' }}
        ref={ref}
        h="100vh"
      >
        <Box
          pos="absolute"
          bgColor="gray.50"
          w={{ base: 'full', md: '45%' }}
          zIndex={-1}
          h="full"
          left={0}
          display={{ base: 'none', xl: 'block' }}
          pt={{ base: '0', lg: 'var(--nav-height)' }}
        />
        <Box
          pos="absolute"
          bgImage="linear-gradient(-135deg,#cdf7f6 0.00%,#9a94bc 100.00%)"
          w={{ base: 'full', lg: '55%' }}
          zIndex={-1}
          h="full"
          right={0}
          display={{ base: 'none', xl: 'block' }}
          pt="var(--nav-height)"
        />
        <Container
          maxW="full"
          className="flex flex-wrap"
          px={0}
          maxH="100%"
          h="full"
        >
          <Box
            bgColor={{ base: 'gray.50', xl: 'transparent' }}
            w={{ base: 'full', lg: '45%' }}
            pt="var(--nav-height)"
            h="full"
          >
            <Box
              // py="50px"
              py={{ base: '2vh', md: '2.5vh', lg: '5vh', '2xl': '7vh' }}
              className="flex flex-col"
              w="full"
              h="full"
              boxSizing="border-box"
            >
              <If condition={files.length}>
                <Then>
                  <Box
                    className="flex flex-col"
                    maxW="500px"
                    w="full"
                    flexGrow={1}
                    mx="auto"
                    px={5}
                  >
                    <Switch>
                      <Case condition={isUploaded && shareVia === 'email'}>
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize={{ base: '3xl', md: '4xl', lg: '44px' }}
                        >
                          {t('uploader:your-data-is-delivered')}
                        </Text>
                        <Text
                          color="gray.400"
                          maxW="350px"
                          textAlign="center"
                          mx="auto"
                          fontSize={{ base: 'lg', md: 'xl', lg: '22px' }}
                          lineHeight={1}
                        >
                          {t('uploader:we-have-delivered-your-data-paragraph')}
                        </Text>
                        <Text fontSize="lg" mt="8">
                          {t('uploader:delivered-files')}:
                        </Text>
                      </Case>
                      <Case condition={isUploaded && shareVia === 'link'}>
                        <Text
                          w="full"
                          textAlign="center"
                          fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                        >
                          {t('uploader:ready-to-share')}
                        </Text>
                        <Text
                          color="gray.400"
                          maxW="350px"
                          textAlign="center"
                          mx="auto"
                          fontSize={{ base: 'lg', md: 'xl', lg: '22px' }}
                          lineHeight={1}
                        >
                          {t('uploader:your-data-is-ready-to-share-paragraph')}
                        </Text>
                        <Text fontSize="lg" mt="8">
                          {t('uploader:uploaded-files')}:
                        </Text>
                      </Case>
                      <Case condition={isUploading}>
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                        >
                          {t('uploader:we-are-uploading')}
                        </Text>
                        <Text
                          color="gray.400"
                          maxW="350px"
                          textAlign="center"
                          mx="auto"
                          fontSize={{ base: 'lg', md: 'xl', lg: '22px' }}
                          lineHeight={1}
                        >
                          {t('uploader:your-data-is-now-uploading-paragraph')}
                        </Text>
                        <Text fontSize="lg" mt="8">
                          {t('uploader:uploading-files')}:
                        </Text>
                      </Case>
                      <Default>
                        <Box
                          alignSelf="center"
                          className="flex flex-col items-center"
                          w="full"
                        >
                          <UploadButton
                            variant="rectangular"
                            onChange={(files) => handleAddFiles(files)}
                          />
                        </Box>
                        <Text fontSize="lg" mt="3vh">
                          {t('uploader:added-files')}:
                        </Text>
                      </Default>
                    </Switch>
                    <Flex mt="3" direction="column">
                      <Flex px={0} sx={{ fontSize: '16px' }}>
                        <Box
                          px={0}
                          textTransform="capitalize"
                          flex="9"
                          color="gray.500"
                        >
                          {t('uploader:name')}
                        </Box>
                        <Box
                          px={0}
                          textTransform="capitalize"
                          textAlign="right"
                          flex="3"
                          color="gray.500"
                        >
                          {t('uploader:size')}
                        </Box>
                        <Box
                          pr={0}
                          w="22px"
                          display={
                            isUploading || isUploaded ? 'none' : 'initial'
                          }
                        >
                          &nbsp;
                        </Box>
                      </Flex>
                      {files.slice(0, 3).map((file) => (
                        <Flex
                          key={file.name}
                          px={0}
                          direction="row"
                          alignItems="center"
                          sx={{ fontSize: '16px' }}
                          borderBottom="1px solid gray"
                        >
                          <Box
                            textOverflow="ellipsis"
                            overflow="hidden"
                            maxW="200px"
                            flex="9"
                            whiteSpace="nowrap"
                          >
                            {file.name}
                          </Box>
                          <Box p={0} textAlign="right" flex="3">
                            {getRelativeSize(file.size)}
                          </Box>
                          <Box
                            px={0}
                            ml="auto"
                            w="22px"
                            display={
                              isUploading || isUploaded ? 'none' : 'initial'
                            }
                          >
                            <IconButton
                              mt={1.5}
                              aria-label="remove file"
                              variant="unstyled"
                              size="sm"
                              icon={<Icon as={SvgDelete} boxSize="22px" />}
                              disabled={isUploading}
                              onClick={() => removeFile(file.name)}
                            />
                          </Box>
                        </Flex>
                      ))}
                    </Flex>
                    <When condition={files.length > 3}>
                      <Button
                        variant="unstyled"
                        color="primary.500"
                        fontWeight="normal"
                        mt="1vh"
                        mx="auto"
                        onClick={() => toggleSeeMore(true)}
                      >
                        {t('uploader:see-more')}
                      </Button>
                    </When>
                    <When condition={isSeeMore}>
                      <FilesModal
                        files={files}
                        removeFile={
                          isUploading || isUploaded ? () => null : removeFile
                        }
                        isOpen={isSeeMore}
                        onClose={() => toggleSeeMore(false)}
                      />
                    </When>
                    <Error mt={4} message={uploadErr} />
                    <Switch>
                      <Case condition={isUploading}>
                        <Box
                          className="flex flex-col"
                          mt={6}
                          flexGrow={1}
                          mb={4}
                        >
                          <CircularProgress
                            value={uploadProgress}
                            capIsRound
                            trackColor="primary.100"
                            size="190px"
                            thickness="8px"
                            color="primary.500"
                            m="auto"
                          >
                            <CircularProgressLabel>
                              {Math.floor(uploadProgress)}
                              <Box as="sup" top="-0.25em">
                                %
                              </Box>
                            </CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                      </Case>
                      <Case condition={isUploaded}>
                        <Box
                          className="flex flex-col justify-center items-center"
                          mt="0vh"
                          flexGrow={1}
                          mb="1vh"
                        >
                          <Img
                            src={greetingPerson}
                            alt="greeting person"
                            aspectRatio={1}
                            maxW="full"
                            maxH="30vh"
                          />
                          <If condition={shareVia === 'link'}>
                            <Then>
                              <InputGroup
                                borderColor="primary.500 !important"
                                size={{ base: 'sm', md: 'md' }}
                              >
                                <Input
                                  type="text"
                                  color="primary.500"
                                  borderColor="primary.500 !important"
                                  defaultValue={downloadLink || ''}
                                  readOnly
                                />
                                <InputRightElement bgColor="gray.50" bottom={0}>
                                  <IconButton
                                    colorScheme="primary"
                                    color="primary.300"
                                    borderColor="primary.500"
                                    roundedLeft="none"
                                    variant="outline"
                                    height="100%"
                                    aria-label="copy link"
                                    icon={<CopyIcon />}
                                    _hover={{
                                      color: 'white',
                                      bgColor: 'primary.500',
                                    }}
                                    onClick={() =>
                                      copyTextToClipboard(downloadLink)
                                    }
                                  />
                                </InputRightElement>
                              </InputGroup>
                            </Then>
                            <Else>
                              <Button
                                variant="solid"
                                colorScheme="primary"
                                mx="auto"
                                mb="1.5vh"
                                size="sm"
                                fontSize="md"
                                onClick={() => setShareVia('link')}
                              >
                                {t('uploader:share-with-others')}
                              </Button>
                            </Else>
                          </If>
                        </Box>
                      </Case>
                      <Default>
                        <Box
                          as="form"
                          className="flex flex-col"
                          mt="2vh"
                          flexGrow={1}
                          mb="2vh"
                          onSubmit={(e: FormEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            return upload();
                          }}
                        >
                          <RadioGroup
                            as={Flex}
                            align="center"
                            gap="7"
                            value={shareVia}
                            onChange={(via: 'email' | 'link') => {
                              setShareVia(via);
                              setFormData({ email: '', title: '' });
                            }}
                          >
                            <Radio
                              value="email"
                              colorScheme="primary"
                              bgColor="primary.100"
                              _checked={{ bgColor: 'primary.500' }}
                            >
                              {t('uploader:via-email')}
                            </Radio>
                            <Radio
                              value="link"
                              colorScheme="primary"
                              bgColor="primary.100"
                              _checked={{ bgColor: 'primary.500' }}
                            >
                              {t('uploader:via-link')}
                            </Radio>
                          </RadioGroup>
                          <When condition={shareVia === 'email'}>
                            <FormControl mt="2vh">
                              <Input
                                type="email"
                                aria-label="email"
                                bgColor="transparent"
                                borderColor="gray.400"
                                placeholder={t('uploader:Email')}
                                required
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData((st) => ({
                                    ...st,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            </FormControl>
                            <FormControl mt="2vh">
                              <Input
                                type="text"
                                aria-label="title"
                                bgColor="transparent"
                                borderColor="gray.400"
                                placeholder={t('uploader:title')}
                                required
                                value={formData.title}
                                onChange={(e) =>
                                  setFormData((st) => ({
                                    ...st,
                                    title: e.target.value,
                                  }))
                                }
                              />
                            </FormControl>
                          </When>
                          <Button
                            variant="solid"
                            colorScheme="primary"
                            mt="auto"
                            mx="auto"
                            mb="0vh"
                            size="sm"
                            fontSize="md"
                            type="submit"
                            sx={{
                              '@media screen (min-height: 700px)': {
                                '&': {
                                  // mt: '1vh',
                                  mb: '2vh',
                                },
                              },
                            }}
                          >
                            {t('uploader:share-now')}
                          </Button>
                        </Box>
                      </Default>
                    </Switch>
                  </Box>
                </Then>
                <Else>
                  <VStack flexGrow={1} my="auto" h="full">
                    <Text fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                      {t('uploader:upload-your-data')}
                    </Text>
                    <Text
                      color="gray.400"
                      maxW="322px"
                      textAlign="center"
                      fontSize={{ base: 'lg', md: 'xl', lg: '22px' }}
                      lineHeight={1}
                    >
                      {t('uploader:deliver-your-data-fast-line')}
                    </Text>
                    <Box
                      className="flex flex-col items-center justify-center"
                      my="auto"
                      w="full"
                    >
                      <UploadButton
                        variant="circular"
                        onChange={(files) => handleAddFiles(files)}
                      />
                    </Box>
                  </VStack>
                </Else>
              </If>
              <Flex
                align="center"
                justify="space-around"
                w="full"
                maxW="450px"
                mx="auto"
                h="30px"
                sx={{
                  '@media (max-height: 700px)': {
                    '&': {
                      display: files.length ? 'none' : 'flex',
                    },
                  },
                  '& *': {
                    textTransform: 'capitalize',
                  },
                }}
              >
                <Text
                  className="flex items-center"
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  letterSpacing={0.5}
                  gap={2}
                  color="primary.500"
                >
                  <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
                  {t('common:upload')}
                </Text>
                <Text
                  className="flex items-center"
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  letterSpacing={0.5}
                  gap={2}
                  color={files.length ? 'primary.500' : 'gray.500'}
                >
                  <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
                  {t('common:share')}
                </Text>
                <Text
                  className="flex items-center"
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  letterSpacing={0.5}
                  gap={2}
                  color={isUploaded ? 'primary.500' : 'gray.500'}
                >
                  <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
                  {t('common:enjoy')}
                </Text>
              </Flex>
            </Box>
          </Box>
          <Box
            bgImage={{
              base: 'linear-gradient(-135deg,#cdf7f6 0.00%,#9a94bc 100.00%)',
              xl: 'transparent',
            }}
            w={{ base: 'full', lg: '55%' }}
            className="flex"
            pos="relative"
            h={{ base: '50%', lg: 'full' }}
            pt="var(--nav-height)"
          >
            <Box
              pos="absolute"
              inset={0}
              className="flex items-center justify-center"
              pt={{ base: '0', lg: '8%' }}
            >
              <If condition={Boolean(creative)}>
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
          </Box>
        </Container>
      </Flex>
    );
  },
);

export default Hero;
