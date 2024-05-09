import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Box, Divider, Flex, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Topbar from '../Topbar';
import Announcement from '../Announcement';
import EmailChangeModal from './EmailChangeModal';
import PasswordChangeModal from './PasswordChangeModal';
import UploadFiles from '../Manage/UploadFiles';
import useAuth from '../../../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { changeLanguage } from '../../../api/user';
import Error from '../../Error';
import { useLanguage } from '../../../i18n';

export default function Preferences(props: RouteComponentProps) {
  const { t } = useTranslation('auth');
  const { changeLanguage: changeLng } = useLanguage();
  const { user, refetchUser } = useAuth();
  const { isLoading, mutate, error } = useMutation(
    (lang: string) => changeLanguage(lang),
    {
      onSuccess: () => {
        refetchUser();
      },
    },
  );
  const err = (error as any)?.message || '';
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title={t("dashboard:preferences")}
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
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <Text>{t('login-details')}</Text>
            <Text color="gray.500" mt={2}>
              {t('your-email-is')}
            </Text>
            <Text mt={8} _firstLetter={{ textTransform: 'unset' }}>{user?.email}</Text>
            <Flex align="center" gap={5} mt={2} flexWrap="wrap">
              <EmailChangeModal />
              <PasswordChangeModal />
            </Flex>
            <Divider borderColor="gray.900" my="12" />
            <Text>{t('language')}</Text>
            <Text color="gray.500" mt={2}>
              {t('your-language-is-currently')}
            </Text>
            <Select
              borderColor="primary.400 !important"
              w="full"
              maxW="217px"
              mt={2}
              disabled={isLoading}
              value={user?.language}
              onChange={(e) => mutate(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </Select>
            <Error message={err} />
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
