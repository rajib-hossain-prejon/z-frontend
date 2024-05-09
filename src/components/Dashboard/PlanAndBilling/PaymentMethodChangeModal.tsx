import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Switch as ChSwitch,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { Case, Switch } from 'react-if';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';

import Error from '../../Error';
import { updatePaymentMethod } from '../../../api/user';
import useAuth from '../../../hooks/useAuth';
import SvgMastercard from '../../icons/SvgMastercard';
// import SvgPaypal from '../../icons/SvgPaypal';
import SvgVisa from '../../icons/SvgVisa';
import SvgPaysafe from '../../icons/SvgPaysafe';

const paymentMethods = [
  { name: 'mastercard', icon: SvgMastercard, height: '48px' },
  { name: 'visa', icon: SvgVisa, height: '88px' },
  { name: 'paysafe', icon: SvgPaysafe, height: '22px' },
];

export default function PaymentMethodChangeModal() {
  const { t } = useTranslation('pricing');
  const { refetchUser } = useAuth();
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();

  const [paymentMethod, setPaymentMethod] =
    React.useState<string>('mastercard');
  const [nameOnCard, setNameOnCard] = React.useState('');
  const [cardErr, setCardErr] = React.useState('');

  const stripe = useStripe();
  const elements = useElements();

  const onClose = () => {
    setNameOnCard('');
    setPaymentMethod('mastercard');
    _onClose();
  };

  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (vals: {
      service: 'stripe' | 'paypal';
      stripeCardData?: {
        stripeId: string;
        nameOnCard: string;
        brand: 'visa' | 'mastercard';
        last4: string;
      };
    }) => updatePaymentMethod(vals),
    {
      onSuccess: () => {
        refetchUser()
          .then(() => setLoading(false))
          .then(() => onClose());
      },
      onError: () => setLoading(false),
    },
  );
  const err = (error as any)?.message || '';

  const onConfirm = async () => {
    if (paymentMethod === 'paypal') {
      return mutate({ service: 'paypal' });
    }
    if (!stripe || !elements) return;
    setLoading(true);
    const cardElem = await elements.getElement('card');
    if (!cardElem) return;
    const result = await stripe?.createPaymentMethod({
      type: 'card',
      card: cardElem,
    });
    if (paymentMethod === 'mastercard' || paymentMethod === 'visa') {
      mutate({
        service: 'stripe',
        stripeCardData: {
          stripeId: result.paymentMethod?.id || '',
          nameOnCard,
          last4: result.paymentMethod?.card?.last4 || '',
          brand: result.paymentMethod?.card?.brand as 'visa' | 'mastercard',
        },
      });
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outline"
        colorScheme="primary"
        px={2}
        w="fit-content"
        fontWeight="normal"
        onClick={() => onOpen()}
      >
        {t('edit-payment-method')}
      </Button>
      <Modal
        isOpen={isOpen || isLoading}
        onClose={() => onClose()}
        isCentered
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent w="95%" minH="fit-content">
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" py="64px">
            <Text fontSize="3xl">{t('payment-method')}</Text>
            <Flex align="center" gap={2}>
              {paymentMethods.map((method) => (
                <Button
                  key={method.name}
                  variant="unstyled"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgColor={
                    paymentMethod === method.name
                      ? 'primary.50'
                      : 'gray.50'
                  }
                  rounded="lg"
                  w="136px"
                  h="73px"
                  disabled={method.name === 'paysafe'}
                  onClick={() =>setPaymentMethod(method.name)}
                >
                  <Icon
                    as={method.icon}
                    w="auto"
                    h={method.height || '60px'}
                  />
                </Button>
              ))}
            </Flex>
            <Error message={cardErr || err} mt={6} />
            <Switch>
              <Case
                condition={
                  paymentMethod === 'mastercard' || paymentMethod === 'visa'
                }
              >
                <Box className="flex flex-col" mt={5} gap={5}>
                  <FormControl>
                    <FormLabel color="gray.500" mb={0}>
                      {t('name-on-card')}*
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder={t('name-on-card')}
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="gray.500" mb={0}>
                      Card
                    </FormLabel>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      _hover={{
                        borderColor: 'gray.300',
                      }}
                      px={2}
                      py={3}
                      rounded="lg"
                      as={CardElement}
                      onChange={(e: StripeCardElementChangeEvent) => {
                        if (['mastercard', 'visa'].includes(e.brand)) {
                          setPaymentMethod(e.brand);
                          setCardErr('');
                        } else
                          setCardErr('Invalid card, enter Mastercard or Visa');
                      }}
                    />
                  </FormControl>
                </Box>
              </Case>
              <Case condition={paymentMethod === 'paysafe'}>
                <Box className="flex flex-col" mt={5}>
                  <Text fontSize="3xl" color="primary.500" fontWeight="semibold">{t('dashboard:paysafe-is-coming')}</Text>
                  <Text maxW="86%">{t('dashboard:we-are-working-on-paysafe-line')}</Text>
                </Box>
              </Case>
              <Case condition={paymentMethod === 'paypal'}>
                <Box className="flex flex-col" mt={5} gap={5}>
                  <Text color="gray.500">
                    {t('paypal-info-line1')}
                    <br />
                    {t('paypal-info-line2')}
                  </Text>
                  <Text className="flex justify-between items-center">
                    {t('paypal-info-line3')}
                    <ChSwitch colorScheme="primary" />
                  </Text>
                </Box>
              </Case>
            </Switch>
            <Flex align="center" justify="flex-end" gap={5} mt="10">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                isLoading={isLoading}
                isDisabled={paymentMethod === 'paysafe'}
                onClick={() => onConfirm()}
              >
                {t('common:confirm')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
