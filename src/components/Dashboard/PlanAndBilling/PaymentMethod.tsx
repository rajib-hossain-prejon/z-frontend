import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, WarningIcon } from '@chakra-ui/icons';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import { useTranslation } from 'react-i18next';

import useAuth from '../../../hooks/useAuth';
import PaymentMethodChangeModal from './PaymentMethodChangeModal';

export default function PaymentMethod() {
  const { t } = useTranslation('pricing');
  const { user } = useAuth();
  const isPendingConfirmation = Boolean(user?.paymentMethod?.verificationLink);
  return (
    <Flex gap="2">
      <Box w="full">
        <Text>{t('payment-method')}</Text>
        <Switch>
          <Case condition={user?.paymentMethod?.service === 'stripe'}>
            <Text color="gray.500" mt={2}>
              {t('you-are-using')}&nbsp;
              <span style={{ textTransform: 'capitalize' }}>
                {user?.paymentMethod?.stripeCardData?.brand}
              </span>
              &nbsp;
              {t('ending-with')}&nbsp;
              {user?.paymentMethod?.stripeCardData?.last4}
              <br />
              {t('name-on-card-is')}&nbsp;
              {user?.paymentMethod?.stripeCardData?.nameOnCard}
            </Text>
          </Case>
          <Case condition={user?.paymentMethod?.service === 'paypal'}>
            <Text color="gray.500" mt={2}>
              {t('you-are-using')}&nbsp;Paypal
            </Text>
          </Case>
        </Switch>
        <Flex gap={2} flexWrap="wrap" align="center" mt={8}>
          <PaymentMethodChangeModal />
          <When condition={isPendingConfirmation}>
            <Button
              as="a"
              target="_blank"
              href={user?.paymentMethod?.verificationLink}
              variant="outline"
              colorScheme="yellow"
              leftIcon={<WarningIcon />}
            >
              {t('pending-confirmation')}
            </Button>
          </When>
        </Flex>
      </Box>
      <If condition={Boolean(user?.paymentMethod) && !isPendingConfirmation}>
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
