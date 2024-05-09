import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Avatar, Box, Divider, Flex, Select, Text } from '@chakra-ui/react';
import { Link } from 'gatsby';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import AccountNameChangeModal from './AccountNameChangeModal';
import URLChangeModal from './URLChangeModal';
import DeleteAccountConfirmModal from './DeleteAccountConfirmModal';
import AvaterChange from './AvatarChange';
import Topbar from '../Topbar';
import Announcement from '../Announcement';
import useAuth from '../../../hooks/useAuth';
import UploadFiles from '../Manage/UploadFiles';
import Error from '../../Error';
import { changeDefaultworkspace } from '../../../api/user';
import { getWindow } from '../../../utils/inBrowser';

export default function Account(props: RouteComponentProps) {
  const { t } = useTranslation(['auth', 'dashboard']);
  const { user, refetchUser } = useAuth();
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(changeDefaultworkspace, {
    onMutate: () => setLoading(true),
    onSuccess: () => {
      refetchUser().then(() => setLoading(false));
    },
    onError: () => setLoading(false),
  });
  const err = (error as any)?.message || '';
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title="Dashboard"
        description={t('dashboard:dashboard-description-line')}
        actions={
          <Box order={{ base: 2, md: 3 }} ml="auto">
            <UploadFiles workspaceId={user?.workspaces[0]?._id} />
          </Box>
        }
      />
      <Flex
        flexDir="row"
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
        gap={5}
        w="full"
        pt="14"
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0 !important',
          },
        }}
      >
        <Box
          className="flex flex-col"
          flexGrow={1}
          pb="5"
          flexBasis={{ base: '100%', md: '0%' }}
          order={{ base: 2, md: 0 }}
        >
          <Box bgColor="gray.50" p="5%" rounded="xl">
            <Flex align="center" gap={5}>
              <Avatar
                name={user?.fullName}
                src={
                  process.env.GATSBY_BACKEND_URL && user?.avatar
                    ? `${process.env.GATSBY_BACKEND_URL}/uploads/images/${user?.avatar}`
                    : 'https://www.dummyimage.com/100x100/2B2B2B/fff'
                }
                boxSize="108px"
                bgColor="gray.300"
              />
              <Text _firstLetter={{ textTransform: 'unset' }}>{user?.username}</Text>
            </Flex>
            <Flex align="center" gap={5} mt={8} flexWrap="wrap">
              <AccountNameChangeModal />
              <AvaterChange />
            </Flex>
            <Divider borderColor="gray.900" my="12" />
            <Text>Zoxxo URL</Text>
            <Text mt="3" color="gray.500">
              {t('auth:all-the-urls-for-your-files-contain-this')}
            </Text>
            <Text mt="8" _firstLetter={{ textTransform: 'lowercase' }}>{`${getWindow()?.origin}/users/${user?.zoxxoUrl || user?.username
              }`}</Text>
            <Flex align="center" gap={5} mt={3}>
              <URLChangeModal />
              <Select
                borderColor="primary.400 !important"
                w="fit-content"
                disabled={isLoading}
                value={
                  typeof user?.defaultWorkspace === 'string'
                    ? user?.defaultWorkspace
                    : user?.defaultWorkspace?._id
                }
                onChange={(e) => mutate(e.target.value)}
              >
                {user?.workspaces.map((ws) => (
                  <option value={ws._id} key={ws.name}>
                    {ws.name}
                  </option>
                ))}
              </Select>
              <Error message={err || ''} />
            </Flex>
          </Box>
          <Box className="flex flex-col" px="5%" flexGrow={1} mt="9" pb={4}>
            <Text>{t('auth:delete-your-account')}</Text>
            <Text mt="3" color="gray.500">
              {t('auth:delete-account-line')}&nbsp;
              <Text as={Link} to="/dashboard/plan" color="primary.500">
                {t('auth:cancel-subscription')}
              </Text>
              &nbsp;{t('auth:instead-of-deleting-your-account')}
            </Text>
            <DeleteAccountConfirmModal />
          </Box>
        </Box>
        <Box
          className="flex flex-col"
          pos={{ base: 'static', md: 'sticky' }}
          flexBasis={{ base: '100%', md: 'fit-content' }}
          top={0}
        >
          <Announcement />
        </Box>
      </Flex>
    </Box>
  );
}
