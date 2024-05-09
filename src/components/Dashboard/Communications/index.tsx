import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Box, Divider, Flex, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Topbar from '../Topbar';
import Announcement from '../Announcement';
import useAuth from '../../../hooks/useAuth';
import UploadFiles from '../Manage/UploadFiles';

export default function Communications(props: RouteComponentProps) {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title={t("communications")}
        description={t('dashboard-description-line')}
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
          h="fit-content"
        >
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <Flex align="center" justify="space-between">
              <Box className="flex flex-col">
                <Text>{t('product-intro-tips-and-inspiration')}</Text>
                <Text color="gray.500" mt={2}>
                  {t('how-to-make-your-uploads-successful')}
                </Text>
              </Box>
              <Switch colorScheme="primary" size="lg" />
            </Flex>
            <Divider borderColor="gray.900" my="12" />
            <Flex align="center" justify="space-between">
              <Box className="flex flex-col">
                <Text>{t('company-news')}</Text>
                <Text color="gray.500" mt={2}>
                  {t('updates-about-zoxxo-and-our-latest-features')}
                </Text>
              </Box>
              <Switch colorScheme="primary" size="lg" />
            </Flex>
            <Divider borderColor="gray.900" my="12" />
            <Flex align="center" justify="space-between">
              <Box className="flex flex-col">
                <Text>{t('coupons-and-announcements')}</Text>
                <Text color="gray.500" mt={2}>
                  {t('saving-your-a-lots-of-money')}
                </Text>
              </Box>
              <Switch colorScheme="primary" size="lg" />
            </Flex>
          </Box>;
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
