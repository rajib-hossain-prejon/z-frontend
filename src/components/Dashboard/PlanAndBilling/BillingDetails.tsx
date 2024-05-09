import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Else, If, Then, When } from 'react-if';
import { useTranslation } from 'react-i18next';

import BillingDetailsChangeModal from './BillingDetailsChangeModal';
import useAuth from '../../../hooks/useAuth';

export default function BillingDetails() {
  const { t } = useTranslation('pricing');
  const { user } = useAuth();
  return (
    <Flex gap="2">
      <Box w="full">
        <Text>{t('billing-details')}</Text>
        <If condition={Boolean(user?.billing)}>
          <Then>
            <When condition={Boolean(user?.subscription)}>
              <Text
                color="gray.500"
                mt={2}
                display={user?.subscription?.price ? 'block' : 'none'}
              >
                {t('your-next-invoice-is-for')
                  .replace('price', user?.subscription?.price?.toString() || '')
                  .replace('date', '2 June 203')}
              </Text>
            </When>
          </Then>
          <Else>
            <Text color="gray.500" mt={2}>
              {t('billing-is-not-setup')}
            </Text>
          </Else>
        </If>
        <When condition={Boolean(user?.billing)}>
          <Box className="flex flex-col" mt={8}>
            <Text>{user?.billing?.name}</Text>
            <Text>{user?.billing?.address}</Text>
            <Text>
              {`${user?.billing?.postalCode + ','} ${user?.billing?.city} ${
                user?.billing?.country
              }`}
            </Text>
          </Box>
        </When>
        <BillingDetailsChangeModal />
      </Box>
      <If condition={Boolean(user?.billing)}>
        <Then>
          <CheckCircleIcon boxSize="24px" color="green.500" />
        </Then>
        <Else>
          <CloseIcon
            boxSize="24px"
            p={1}
            bgColor="red.400"
            color="white"
            rounded="full"
          />
        </Else>
      </If>
    </Flex>
  );
}
