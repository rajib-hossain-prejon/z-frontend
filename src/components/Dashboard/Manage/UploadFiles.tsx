import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, CopyIcon } from '@chakra-ui/icons';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import { SketchPicker } from 'react-color';
import { useParams } from '@reach/router';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import UploadButton from '../../HomeHero/UploadButton';
import OutlineButton from '../OutlineButton';
import useUploadFileStore from '../../../hooks/useUploadFileStore';
import {
  copyTextToClipboard,
  getRelativeSize,
  isBrowser,
} from '../../../utils';
import SvgDelete from '../../icons/SvgDelete';
import FilesModal from '../../FilesModal';
import {
  getWorkspaceUploadLinks,
  validateUploadCompletion,
} from '../../../api/user';
import Error from '../../Error';
import useAuth from '../../../hooks/useAuth';
import TornadoFeatureAlert from '../../TornadoFeatureAlert';

const colors = [
  '#B47979',
  '#B4A279',
  '#84B479',
  '#79AFB4',
  '#7E79B4',
  '#B479AD',
];

function FilesTable(props: {
  files: File[];
  disableRemove?: boolean;
  removeFile?: (name: string) => void;
  hideRemoveButton?: boolean;
}) {
  const { t } = useTranslation('uploader');
  const [isSeeMore, setSeeMore] = React.useState(false);

  const removeFile =
    typeof props.removeFile === 'function'
      ? props.removeFile
      : (n: string) => { };

  return (
    <Flex mt="3" direction="column" textAlign="left">
      <Flex px={0} sx={{ fontSize: '16px' }}>
        <Box px={0} textTransform="capitalize" flex="9" color="gray.500">
          {t('name')}
        </Box>
        <Box
          px={0}
          textTransform="capitalize"
          textAlign="right"
          flex="3"
          color="gray.500"
        >
          {t('size')}
        </Box>
        <When condition={!props.hideRemoveButton}>
          <Box pr={0} w="22px">
            &nbsp;
          </Box>
        </When>
      </Flex>
      {props.files.slice(0, 3).map((file) => (
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
          <When condition={!props.hideRemoveButton}>
            <Box px={0} ml="auto" w="22px">
              <IconButton
                mt={1.5}
                aria-label="remove file"
                variant="unstyled"
                size="sm"
                icon={<Icon as={SvgDelete} boxSize="22px" />}
                disabled={props.disableRemove}
                onClick={() => removeFile(file.name)}
              />
            </Box>
          </When>
        </Flex>
      ))}
      <When condition={props.files.length > 3}>
        <Button
          variant="unstyled"
          color="primary.500"
          fontWeight="normal"
          mt="5"
          mx="auto"
          onClick={() => setSeeMore(true)}
        >
          {t('see-more')}
        </Button>
      </When>
      <When condition={isSeeMore}>
        <FilesModal
          files={props.files}
          removeFile={removeFile}
          isOpen={isSeeMore}
          onClose={() => setSeeMore(false)}
        />
      </When>
    </Flex>
  );
}

let source = axios.CancelToken.source();

function UploadFile(props: {
  workspaceId?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('uploader');
  const {
    files,
    addFiles,
    removeFile,
    color,
    setColor,
    image,
    setImage,
    reset,
  } = useUploadFileStore();
  const { user, refetchUser } = useAuth();
  const id = useParams()?.id || props.workspaceId;
  const client = useQueryClient();
  const [step, setStep] = React.useState<'upload' | 'customize' | 'enjoy'>(
    'upload',
  );
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [downloadLink, setDownloadLink] = React.useState('');
  const [uploadErr, setUploadErr] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');

  const tornadoFeatureAlert = useDisclosure();

  const upload = async () => {
    try {
      source = axios.CancelToken.source();
      setUploadErr('');
      setIsUploading(() => true);
      const { uploadUrls: urls, upload } = await getWorkspaceUploadLinks(id, {
        files: files,
        color: color ? color.replace('#', '') : '',
        coverImage: image as File | undefined,
      });
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
            onUploadProgress: (event) => {
              individualUploaded[i] = event.loaded;
              const percent = calcPercent();
              setUploadProgress(() => percent);
              if (percent >= 100) {
                validateUploadCompletion(id, upload._id)
                  .then(() => {
                    setIsUploading(() => false);
                    setDownloadLink(
                      () =>
                        `${isBrowser() ? window.location.origin : ''
                        }/download?uploadId=${upload._id}`,
                    );
                    setStep(() => 'enjoy');
                    client.invalidateQueries(['workspace']);
                    // refetch user details to update number uploads in workspaces
                    refetchUser();
                  })
                  .catch((e: any) => {
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

  const handleClose = () => {
    source.cancel();
    reset();
    props.onClose();
  };

  const nextStep = () => {
    if (step === 'upload' && files.length > 0) return setStep('customize');
    if (step === 'customize') {
      return upload();
    }
    if (step === 'enjoy') {
      return handleClose();
    }
  };

  React.useEffect(() => {
    if (image && !imgUrl) setImgUrl(URL.createObjectURL(image));
  }, [image, imgUrl]);

  React.useEffect(() => {
    // cancel any background requests
    return () => {
      reset();
      source.cancel();
    };
  }, []);
  return (
    <Box
      className="flex flex-wrap"
      pos="absolute"
      insetX="0"
      top="0"
      h="max(100vh, 900px)"
      zIndex={100}
    >
      <Box
        w={{ base: 'full', md: '50%' }}
        pt={{ base: '5%', lg: '70px', xl: '100px' }}
        pb={{ base: '5%', lg: '60px' }}
        px="10"
        className="flex flex-col items-center"
        bgColor="gray.50"
        textAlign="center"
        h="full"
      >
        <Switch>
          <Case condition={step === 'upload'}>
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
                  <UploadButton
                    variant="rectangular"
                    onChange={(files) => addFiles(files)}
                  />
                  <Text fontSize="lg" mt="8" alignSelf="flex-start">
                    Added files:
                  </Text>
                  <FilesTable
                    files={files}
                    removeFile={removeFile}
                    disableRemove={isUploading}
                  />
                </Box>
              </Then>
              <Else>
                <Heading fontSize={{ base: '3xl', md: '3xl', lg: '4xl' }}>
                  {t('upload-your-data')}
                </Heading>
                <Text color="gray.500" textAlign="center" maxW="292px" mt="3">
                  {t('deliver-your-data-fast-line')}
                </Text>
                <Box my="auto">
                  <UploadButton onChange={addFiles} />
                </Box>
              </Else>
            </If>
          </Case>
          <Case condition={step === 'customize'}>
            <Box
              className="flex flex-col"
              maxW="500px"
              w="full"
              flexGrow={1}
              mx="auto"
              px={5}
            >
              <If condition={isUploading}>
                <Then>
                  <Text
                    textAlign="center"
                    w="full"
                    fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  >
                    {t('we-are-uploading')}
                  </Text>
                  <Text
                    color="gray.400"
                    maxW="350px"
                    textAlign="center"
                    alignSelf="center"
                    fontSize={{ base: 'lg', md: 'xl' }}
                    lineHeight={1}
                  >
                    {t('your-data-is-now-uploading-paragraph')}
                  </Text>
                  <Text fontSize="lg" mt="8" alignSelf="flex-start">
                    {t('uploaded-files')}:
                  </Text>
                  <FilesTable
                    files={files}
                    removeFile={removeFile}
                    disableRemove={isUploading}
                    hideRemoveButton
                  />
                  <Error message={uploadErr} my={2} />
                  <Box className="flex flex-col" mt={6} flexGrow={1} mb={4}>
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
                </Then>
                <Else>
                  <Heading fontSize={{ base: '3xl', md: '3xl', lg: '4xl' }}>
                    {t('auth:upload-your-image')}
                    <br />
                    {t('common:and')}&nbsp;{t('choose-color')}
                  </Heading>
                  <Text color="gray.500" alignSelf="center" maxW="292px" mt="3">
                    {t('drag-your-cover-image')}&nbsp;{t('common:and')}&nbsp;
                    <br />
                    {t('upload-it-for-name-of-the-file')}
                  </Text>
                  <Box m="auto">
                    <UploadButton inputProps={{ accept: 'image/png,image/jpg,image/jpeg'}} onChange={(f) => {
                      if (!user?.subscription?.type) {
                        tornadoFeatureAlert.onOpen();
                      } else setImage(f[0]);
                    }} />
                    <TornadoFeatureAlert isOpen={tornadoFeatureAlert.isOpen} onClose={tornadoFeatureAlert.onClose} />
                  </Box>
                  <Box
                    className="flex flex-wrap justify-center items-center"
                    gap={4}
                    m="auto"
                  >
                    {colors.map((cl) => (
                      <Box
                        key={cl}
                        as="button"
                        boxSize="41px"
                        bgColor={cl}
                        rounded="full"
                        outline={color === cl ? '4px solid' : '0px solid'}
                        outlineColor="primary.500"
                        outlineOffset={4}
                        onClick={() => setColor(cl)}
                      />
                    ))}
                    <Menu isLazy closeOnBlur closeOnSelect={false}>
                      <MenuButton>
                        <Box
                          boxSize="41px"
                          bgImage="conic-gradient(from 90deg at 50% 50%, #FF0000 0.00%, #EBFF00 12.32%, #CEFF00 24.14%, #0ADF0A 37.93%, #00FFEB 50.25%, #1B35C5 64.53%, #8002FF 76.85%, #FF0000 88.18%, #FF0000 100.00%)"
                          rounded="full"
                        />
                      </MenuButton>
                      <MenuList p={0}>
                        <MenuItem p={0} as="div">
                          <SketchPicker color={color} onChange={(cl) => setColor(cl.hex)} />
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </Else>
              </If>
            </Box>
          </Case>
          <Case condition={step === 'enjoy'}>
            <Box
              className="flex flex-col"
              maxW="500px"
              w="full"
              flexGrow={1}
              mx="auto"
              px={5}
            >
              <Text
                textAlign="center"
                w="full"
                fontSize={{ base: '3xl', md: '4xl', lg: '44px' }}
              >
                {t('ready-to-share')}
              </Text>
              <Text
                color="gray.400"
                maxW="350px"
                textAlign="center"
                mx="auto"
                fontSize={{ base: 'lg', md: 'xl' }}
                lineHeight={1}
              >
                {t('your-data-is-ready-to-share-paragraph')}
              </Text>
              <Text fontSize="lg" mt="8" textAlign="left">
                {t('uploaded-files')}:
              </Text>
              <FilesTable files={files} hideRemoveButton />
              <InputGroup borderColor="primary.500 !important" my="auto">
                <Input
                  type="text"
                  color="primary.500"
                  borderColor="primary.500 !important"
                  defaultValue={downloadLink}
                  readOnly
                />
                <InputRightAddon
                  as={IconButton}
                  color="primary.500"
                  bgColor="primary.100"
                  borderColor="primary.500"
                  variant="ghost"
                  size="sm"
                  aria-label="copy link"
                  icon={<CopyIcon />}
                  onClick={() => copyTextToClipboard(downloadLink)}
                />
              </InputGroup>
            </Box>
          </Case>
        </Switch>
        <Flex
          align="center"
          justify="space-around"
          w="full"
          maxW="450px"
          mx="auto"
          h="30px"
        >
          <Text
            className="flex items-center"
            fontSize={{ base: 'lg', lg: 'xl' }}
            letterSpacing={0.5}
            gap={2}
            color="primary.500"
          >
            <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
            Upload
          </Text>
          <Text
            className="flex items-center"
            fontSize={{ base: 'lg', lg: 'xl' }}
            letterSpacing={0.5}
            gap={2}
            color={
              step === 'customize' || step === 'enjoy'
                ? 'primary.500'
                : 'gray.500'
            }
          >
            <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
            {t('customize')}
          </Text>
          <Text
            className="flex items-center"
            fontSize={{ base: 'lg', lg: 'xl' }}
            letterSpacing={0.5}
            gap={2}
            color={step === 'enjoy' ? 'primary.500' : 'gray.500'}
          >
            <CloseIcon boxSize={{ base: '14px', lg: '16px' }} />
            {t('common:enjoy')}
          </Text>
        </Flex>
        <Flex gap={5} align="center" w="full" justify="flex-end" mt="60px">
          <When condition={uploadProgress !== 100}>
            <OutlineButton size="sm" onClick={() => handleClose()}>
              {t('cancel')}
            </OutlineButton>
          </When>
          <When condition={!isUploading}>
            <Button
              variant="solid"
              size="sm"
              fontWeight="normal"
              colorScheme="primary"
              onClick={() => nextStep()}
            >
              {step === 'enjoy'
                ? t('back-to-workspace')
                : t('next-step')}
            </Button>
          </When>
        </Flex>
      </Box>
      <Box
        w={{ base: 'full', md: '50%' }}
        h="full"
        className="flex items-center justify-center"
        bgImage={
          imgUrl
            ? `url(${imgUrl})`
            : 'linear-gradient(135deg, #9997bf 0.00%, #b0cde8 51.72%, #f21a5d 100.00%)'
        }
        bgPos="50% 50%"
        bgRepeat="no-repeat"
        bgSize="cover"
      >
        <When condition={!image}>
          <Box
            className="flex items-center justify-center"
            bgColor="rgba(255, 255, 255, 0.6)"
            rounded="lg"
            w={{ base: '180px', lg: '230px' }}
            aspectRatio={282 / 237}
          >
            {t('image-preview')}
          </Box>
        </When>
      </Box>
    </Box>
  );
}

export default function UploadFiles(props: { workspaceId?: string }) {
  const { t } = useTranslation('uploader');
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <React.Fragment>
      <Button
        variant="solid"
        colorScheme="primary"
        size="sm"
        leftIcon={<AddIcon />}
        onClick={() => onOpen()}
      >
        {t('upload-a-file')}
      </Button>
      <When condition={isOpen}>
        <UploadFile
          isOpen={isOpen}
          onClose={onClose}
          workspaceId={props.workspaceId}
        />
      </When>
    </React.Fragment>
  );
}
