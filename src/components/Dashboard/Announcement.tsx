import React from 'react';
import { Box, Divider, Icon, Img, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import paysafeLogo from '../../static/paysafe.png';
import announcementPerson from '../../static/announcementPerson.png';
import SvgPaysafe from '../icons/SvgPaysafe';

export default function Announcement() {
  const { t } = useTranslation('dashboard');
  return (
    <Box
      className="flex flex-col"
      bgColor="primary.100"
      h="fit-content"
      pb={8}
      maxW={{ base: 'full', md: '282px' }}
      rounded="xl"
    >
      <Icon as={SvgPaysafe} w="auto" h="22px" alignSelf="center" my="4" />
      <Divider borderColor="gray.600" />
      <Box
        as={Img}
        alt="announcement person"
        src={announcementPerson}
        my={4}
        mx="auto"
        maxW="130px"
      />
      <Text color="primary.500" fontWeight="bold" px={3}>
        {t('paysafe-is-coming')}
      </Text>
      <Text color="gray.800" fontSize="xs" px={3}>
        {t('we-are-working-on-paysafe-line')}
      </Text>
    </Box>
  );
}
