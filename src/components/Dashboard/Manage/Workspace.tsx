import React from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Case, Switch } from 'react-if';
import moment from 'moment';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgMore from '../../icons/SvgMore';
import SvgListBullet from '../../icons/SvgListBullet';
import SvgGridThree from '../../icons/SvgGridThree';
import RenameWorkspaceModal from './RenameWorkspaceModal';
import DeleteWorkspaceModal from './DeleteWorkspaceModal';
import RenameFileModal from './RenameFileModal';
import DeleteFileModal from './DeleteFileModal';
import ShareFileLinkModal from './ShareFileLinkModal';
import ShareWorkspaceLinkModal from './ShareWorkspaceLinkModal';
import UploadFiles from './UploadFiles';
import { getWorkspace, uploadWorkspaceCoverImage } from '../../../api/user';
import Loader from '../../Loader';
import Error from '../../Error';
import UploadCoverImage from './UploadCoverImage';
import { getTextColorForBackground } from '../../../utils';
import MoveFileModal from './MoveFileModal';
import EditUploadFiles from './EditUploadFiles';

export default function Workspace({ uploadName }: RouteComponentProps & { uploadName: string }) {
  const { t } = useTranslation('manage');
  const id = useParams()?.id;
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid');

  const { isLoading, data } = useQuery(['workspace', id], () => getWorkspace(id || ''));
  const filteredUploads = data ? data.uploads.filter((u) => u.name.toLowerCase().includes(uploadName.toLowerCase())) : []

  const [err, setErr] = React.useState('');
  const {
    isLoading: isUploading,
    mutate,
    error,
  } = useMutation((val: File) => uploadWorkspaceCoverImage(id || '', val));

  const [editUploadId, setEditUploadId] = React.useState('');
  const editUpload = {
    onOpen: (id: string) => setEditUploadId(id),
    onClose: () => setEditUploadId(''),
  };

  return (
    <Switch>
      <Case condition={isLoading}>
        <Loader my="8" />
      </Case>
      <Case condition={!data}>
        <Error message={t('workspace-not-found')} my={8} />
      </Case>
      <Case condition={Boolean(data)}>
        <Flex
          align="center"
          flexWrap="wrap"
          py={4}
          w="full"
          boxSizing="border-box"
          borderBottom="1.5px solid"
          borderColor={{ base: 'transparent', md: 'gray.300' }}
          gap={2}
        >
          <Text fontSize="3xl">{data?.name}</Text>
          <Divider
            orientation="vertical"
            borderColor="gray.500"
            h="50%"
            minH="40px"
            mx={3}
            display={{ base: 'none', lg: 'block' }}
          />
          <ShareWorkspaceLinkModal id={id} />
          <Menu>
            <MenuButton
              as={IconButton}
              variant="unstyled"
              mt={2}
              aria-label="share workspace"
              icon={<Icon as={SvgMore} boxSize="24px" />}
            />
            <MenuList>
              <UploadCoverImage
                areColorsVisible
                error={err}
                isLoading={isUploading}
                onSave={(args) => {
                  if (!args.img) {
                    args.close();
                    return setErr('');
                  }
                  mutate(args.img, {
                    onSuccess: () => args.close(),
                    onError: (e) => {
                      if (error) {
                        const msg = (error as any)?.message;
                        if (msg) setErr(msg);
                        else
                          setErr(
                            t('server-error-or-file-size-greater-than-2mb'),
                          );
                      }
                    },
                  });
                }}
              />
              <RenameWorkspaceModal />
              <DeleteWorkspaceModal workspaceId={id} />
            </MenuList>
          </Menu>
          <Box
            className="flex items-center"
            order={{ base: 2, lg: 3 }}
            gap={4}
            ml="auto"
          >
            <UploadFiles />
            <ButtonGroup isAttached size="sm">
              <Button
                variant={layout === 'grid' ? 'solid' : 'outline'}
                colorScheme="primary"
                sx={{
                  '& svg path': {
                    fill: layout === 'grid' ? 'white' : 'primary.500',
                  },
                }}
                leftIcon={<Icon as={SvgGridThree} />}
                onClick={() => setLayout('grid')}
              >
                {t('grid')}
              </Button>
              <Button
                variant={layout === 'list' ? 'solid' : 'outline'}
                colorScheme="primary"
                sx={{
                  '& svg path': {
                    fill: layout === 'list' ? 'white' : 'primary.500',
                  },
                }}
                leftIcon={<Icon as={SvgListBullet} boxSize="21px" />}
                onClick={() => setLayout('list')}
              >
                {t('list')}
              </Button>
            </ButtonGroup>
          </Box>
          <input
            type="file"
            id="topbar-file-input"
            multiple
            style={{ display: 'none' }}
          />
        </Flex>
        <Flex
          flexWrap="wrap"
          w="full"
          pt="14"
          px={1}
          pb={4}
          gap={5}
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0 !important',
            },
          }}
        >
          <Switch>
            <Case condition={!filteredUploads.length}>
              <Text textAlign="center" w="full">
                {t('no-uploads-found')}
              </Text>
            </Case>
            <Case condition={layout === 'list'}>
              <Box
                className="flex flex-col"
                w="full"
                minW="664px"
                overflow="auto"
              >
                <Box className="flex items-center" px={4}>
                  <Text w="60%">{t('uploader:name')}</Text>
                  <Text w="15%" textAlign="center">
                    {t('common:updated')}
                  </Text>
                  <Text w="15%" textAlign="center">
                    {t('common:downloads')}
                  </Text>
                  <Box w="10%" />
                </Box>
                {filteredUploads?.map((upl) => (
                  <Box
                    boxShadow="md"
                    rounded="xl"
                    border="1.5px solid"
                    borderColor="gray.300"
                    w="full"
                    className="flex items-center"
                    p={2}
                    my={2}
                    key={upl._id}
                  >
                    <Flex
                      gap={2}
                      align="center"
                      w="60%" 
                      cursor="pointer"
                      onClick={() => editUpload.onOpen(upl._id)}
                    >
                      <Box
                        rounded="xl"
                        bgColor={
                          upl.color !== '#f21a5d' ? upl.color : 'primary.500'
                        }
                        aspectRatio={1}
                        w="60px"
                      />
                      <Box className="flex flex-col">
                        <Text>{upl.name}</Text>
                        <Text color="gray.500">
                          {t('common:created')}:&nbsp;
                          {moment(upl.createdAt).format('DD.MM.YYYY')}
                        </Text>
                      </Box>
                    </Flex>
                    <Text textAlign="center" w="15%" cursor="pointer" onClick={() => editUpload.onOpen(upl._id)}>
                      {moment(upl.createdAt).format('DD.MM.YYYY')}
                    </Text>
                    <Text textAlign="center" w="15%" cursor="pointer" onClick={() => editUpload.onOpen(upl._id)}>
                      {upl.downloads}
                    </Text>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        variant="unstyled"
                        mt={2}
                        aria-label="share workspace"
                        icon={<Icon as={SvgMore} boxSize="24px" />}
                        mx="auto"
                      />
                      <MenuList>
                        <ShareFileLinkModal id={upl._id} />
                        <EditUploadFiles
                          upload={{
                            ...upl,
                            files: upl.files.map((f) => ({
                              ...f,
                              name: f.filename,
                            })),
                          }}
                          isOpen={upl._id === editUploadId}
                          onOpen={() => editUpload.onOpen(upl._id)}
                          onClose={editUpload.onClose}
                        />
                        <MoveFileModal id={upl._id} />
                        <RenameFileModal id={upl._id} />
                        <DeleteFileModal id={upl._id} name={upl.name} />
                      </MenuList>
                    </Menu>
                  </Box>
                ))}
              </Box>
            </Case>
            <Case condition={layout === 'grid'}>
              {filteredUploads?.map((upl) => (
                <Card
                  shadow="md"
                  w="full"
                  maxW={{ base: '200px', lg: '282px' }}
                  aspectRatio={282 / 326}
                  key={upl._id}
                >
                  <CardBody className="flex flex-col" gap={2} p={0}>
                    <Box
                      bgColor={
                        upl.color !== '#f21a5d' ? upl.color : 'primary.500'
                      }
                      w="full"
                      aspectRatio={282 / 237}
                      roundedTop="lg"
                      className="flex items-center justify-center"
                      p={2}
                      cursor="pointer"
                      onClick={() => editUpload.onOpen(upl._id)}
                    >
                      <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        textAlign="center"
                        maxW="160px"
                        color={getTextColorForBackground(upl.color)}
                      >
                        {upl.name}
                      </Text>
                    </Box>
                    <Box
                      w="full"
                      flex={1}
                      className="flex items-center justify-between"
                      px={2}
                    >
                      <Text>{upl.downloads} Downloads</Text>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          variant="unstyled"
                          mt={2}
                          aria-label="share workspace"
                          icon={<Icon as={SvgMore} boxSize="24px" />}
                        />
                        <MenuList>
                          <ShareFileLinkModal id={upl._id} />
                          <EditUploadFiles
                            upload={{
                              ...upl,
                              files: upl.files.map((f) => ({
                                ...f,
                                name: f.filename,
                              })),
                            }}
                            isOpen={editUploadId === upl._id}
                            onOpen={() => editUpload.onOpen(upl._id)}
                            onClose={editUpload.onClose}
                          />
                          <MoveFileModal id={upl._id} />
                          <RenameFileModal id={upl._id} />
                          <DeleteFileModal id={upl._id} name={upl.name} />
                        </MenuList>
                      </Menu>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Case>
          </Switch>
        </Flex>
      </Case>
    </Switch>
  );
}
