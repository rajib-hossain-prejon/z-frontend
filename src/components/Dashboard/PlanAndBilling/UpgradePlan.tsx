import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Img,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  Radio,
  RadioGroup,
  Stack,
  StackItem,
  Switch,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Else, If, Then, When } from 'react-if';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Topbar from '../Topbar';
import logo from '../../../static/zoxxo_CLR.png';
import greetingPerson from '../../../static/greetingPerson.png';
import BillingDetails from './BillingDetails';
import PaymentMethod from './PaymentMethod';
import { calculatePrice, getRelativeSize } from '../../../utils';
import useAuth from '../../../hooks/useAuth';
import { upgradePlan, verifyPaypalSubscription } from '../../../api/user';
import Error from '../../Error';
import PayPalSubscribeButton from './PayPalSubscribeButton';
import Loader from '../../Loader';
import { useTranslation } from 'react-i18next';

const Success = (props: { onClose: () => void }) => {
  const { t } = useTranslation('pricing');
  const { user } = useAuth();
  return (
    <Box
      className="flex"
      pos="absolute"
      bgColor="primary.100"
      insetX="0"
      top="0"
      minH="max(100vh, 600px)"
      zIndex={100}
    >
      <Box className="flex flex-col" w="full" p="5" m="auto" maxW="920px">
        <Img
          alt="zoxxo logo"
          src={logo}
          w="full"
          aspectRatio={70 / 61}
          maxW="70px"
          mx="auto"
        />
        <Box
          mt={7}
          rounded="lg"
          bgColor="white"
          className="flex items-center"
          py="16"
          px={5}
        >
          <Box className="flex flex-col">
            <Text fontWeight="bold" fontSize="3xl">
              Diviértete&nbsp;-&nbsp;{t('have-fun-my-friend')}
            </Text>
            <Text fontSize="xl" color="gray.600" mt={8}>
              {t('hola-my-friend')},
              <br />{t('i-am-happy-to-welcome-you')}.&nbsp;{t('you-have-now')}&nbsp;
              <b>{getRelativeSize(user?.storageSizeInBytes || 0)}</b>&nbsp;{t('common:and')}&nbsp;
              <b>{user?.maxWorkspaces} Workspaces</b>&nbsp;{t('common:available')}.
            </Text>
            <Flex gap={6} flexWrap="wrap" mt="10">
              <Button
                // as={Link}
                // to={`/manage/${user?.workspaces[0]?._id || ''}`}
                variant="solid"
                colorScheme="primary"
                w="184px"
                fontWeight="normal"
                onClick={() => props.onClose()}
              >
                {t('upload-files')}
              </Button>
              <Button
                as={Link}
                to={`/manage/${user?.workspaces[0]?._id || ''}`}
                variant="solid"
                colorScheme="primary"
                w="184px"
                fontWeight="normal"
                onClick={() => props.onClose()}
              >
                {t('go-to-manage')}
              </Button>
            </Flex>
          </Box>
          <Box
            w="full"
            maxW="444px"
            aspectRatio={1}
            pos="relative"
            display={{ base: 'none', md: 'block' }}
          >
            <Img
              src={greetingPerson}
              alt="greeting person"
              w="full"
              pos="absolute"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function UpgradePlan() {
  const { t } = useTranslation('pricing');
  const { user, refetchUser } = useAuth();

  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const [tab, setTab] = React.useState<'calculator' | 'payment'>('calculator');
  const [isSuccess, setSuccess] = React.useState(false);
  const [workspaces, _setWorkspaces] = React.useState(0);
  const [plan, setPlan] = React.useState<'monthly' | 'yearly'>('monthly');
  const [storage, _setStorage] = React.useState<number | 'custom'>(0);
  const [customStorage, setCustomStorage] = React.useState<number | null>(null);
  const [planId, setPlanId] = React.useState(''); // used for paypal
  const [subscriptionId, setSubscriptionId] = React.useState(''); // used for paypal
  const [paypalErr, setPapalErr] = React.useState('');

  const setStorage = (st: number | 'custom') => {
    _setStorage((s) => (s === st ? 0 : st));
    setCustomStorage(() => 0);
  };
  const setWorkspaces = (ws: number) =>
    _setWorkspaces((w) => (w === ws ? 0 : ws));

  const client = useQueryClient();

  const pricesData = calculatePrice({
    extraStorage: storage === 'custom' ? customStorage || 0 : storage,
    extraWorkspaces: workspaces,
    subscription: plan,
  });

  const { isLoading: isVerifying, mutate: verify } = useMutation(
    (vals: {
      extraStorage: number;
      extraWorkspaces: number;
      subscription: 'monthly' | 'yearly';
      paypalSubscriptionId: string;
    }) => verifyPaypalSubscription(vals),
    {
      onSuccess: (d) => {
        refetchUser().then(() => setSuccess(true)).then(() => client.invalidateQueries(['invoices']));
      },
      onError: (err: any) => setPapalErr(err.message),
    },
  );

  const { isLoading, mutate, error } = useMutation(
    (vals: {
      extraStorage: number;
      extraWorkspaces: number;
      subscription: 'monthly' | 'yearly';
    }) => upgradePlan(vals),
    {
      onSuccess: (d) => {
        if (user?.paymentMethod?.service === 'paypal') {
          setSubscriptionId(() => d.subscriptionId);
          setPlanId(() => d.planId);
        }
        // handle stripe subscription
        else {
          refetchUser().then(() => setSuccess(true)).then(() => client.invalidateQueries(['invoices']));
        }
      },
    },
  );
  const err = (error as any)?.message || '';

  const onClose = () => {
    if (isLoading) return;
    // reset all state
    setTab('calculator');
    setSuccess(false);
    setWorkspaces(0);
    setStorage(0);
    setPlanId('');
    setSubscriptionId('');
    setPapalErr('');
    // close the modal
    _onClose();
  };

  return (
    <React.Fragment>
      <Button
        variant="solid"
        colorScheme="primary"
        fontWeight="normal"
        onClick={() => onOpen()}
      >
        {user?.subscription?.status === 'downgrading' ? t('reactivate-tornado') : t('upgrade-storage')}
      </Button>
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalBody>
            <If condition={isSuccess}>
              <Then>
                <Success onClose={() => onClose()} />
              </Then>
              <Else>
                <Box className="flex flex-col route" h="full" w="full">
                  <Topbar
                    title={t('dashboard:plan-and-billing')}
                    description={t('dashboard:dashboard-description-line')}
                    actions={
                      <IconButton
                        aria-label="close"
                        order={99}
                        ml="auto"
                        size="sm"
                        icon={<CloseIcon />}
                        onClick={() => onClose()}
                      />
                    }
                  />
                  <Flex
                    flexDir="row"
                    flexWrap={{ base: 'wrap', md: 'nowrap' }}
                    gap={5}
                    w="full"
                    py="4"
                    overflowY="auto"
                    maxH="calc(100vh - 95px)"
                    sx={{
                      '&::-webkit-scrollbar': {
                        width: '0 !important',
                      },
                    }}
                  >
                    <Box
                      className="flex flex-wrap justify-between"
                      flexGrow={1}
                      pb="5"
                      flexBasis={{ base: '100%', md: '0%' }}
                      gap={5}
                      h="fit-content"
                      maxW="full"
                    >
                      <When condition={tab === 'calculator'}>
                        <Box className="flex flex-col">
                          <Text fontSize={{base: '2xl', xl: '2xl'}} fontWeight="semibold">
                            {t(`tornado:calculate-your-${plan}-costs-with-tornado`)}
                          </Text>
                          <RadioGroup
                            as={Stack}
                            mt="9"
                            maxW="fit-content"
                            value={plan}
                            onChange={(val: 'monthly' | 'yearly') => setPlan(val)}
                          >
                            <Radio
                              bgColor="primary.100"
                              _checked={{
                                bgColor: 'primary.500',
                                border: '3px solid',
                                borderColor: 'primary.200',
                              }}
                              value="monthly"
                              letterSpacing={1.2}
                              size="lg"
                            >
                              {t('pricing:monthly-billing')}
                            </Radio>
                            <Radio
                              bgColor="primary.100"
                              _checked={{
                                bgColor: 'primary.500',
                                border: '3px solid',
                                borderColor: 'primary.200',
                              }}
                              value="yearly"
                              size="lg"
                              lineHeight={1}
                              letterSpacing={1.2}
                              alignItems="flex-start"
                            >
                              {t('pricing:yearly-billing')}
                              <br />
                              <Text color="primary.500">{t('pricing:save-over-50%')}</Text>
                            </Radio>
                          </RadioGroup>
                          <Box className="flex flex-col" mt={7}>
                            <Text fontSize="27px">{t('tornado:how-much-extra-storage-do-you-need')}</Text>
                            <Box className="flex flex-wrap items-center" gap={4} mt={2}>
                              {[2, 4, 8, 16, 'custom'].map((st) => (
                                <Button
                                  key={st}
                                  variant="outline"
                                  bgColor={
                                    st === storage
                                      ? 'primary.50 !important'
                                      : 'gray.50 !important'
                                  }
                                  borderColor={
                                    st === storage ? 'primary.300' : 'gray.300'
                                  }
                                  fontSize={{base: '2xl', xl: '3xl'}}
                                  fontWeight="normal"
                                  color={st === storage ? 'primary.500' : 'initial'}
                                  py={{base: 6, xl: 8}}
                                  px={{base: 6, xl: 7}}
                                  onClick={() => setStorage(st as number | 'custom')}
                                >
                                  <If condition={st === 'custom'}>
                                    <Then>
                                      <Input
                                        type="number"
                                        variant="unstyled"
                                        rounded="none"
                                        size="lg"
                                        fontSize="3xl"
                                        borderBottom="2px solid"
                                        maxW="50px"
                                        value={customStorage || ''}
                                        onChange={(e) =>
                                          setCustomStorage(Number(e.target.value) > 100 ? 100 : Number(e.target.value))
                                        }
                                      />
                                      &nbsp;TB
                                    </Then>
                                    <Else>{st} TB</Else>
                                  </If>
                                </Button>
                              ))}
                            </Box>
                          </Box>
                          <Box className="flex flex-col" mt={7}>
                            <Text fontSize="27px">{t('tornado:how-many-extra-workspaces-do-you-need')}</Text>
                            <Box className="flex flex-wrap items-center" gap={4} mt={2}>
                              {[3, 5, 10, 20, 50].map((ws) => (
                                <Button
                                  key={ws}
                                  variant="outline"
                                  bgColor={
                                    ws === workspaces
                                      ? 'primary.50 !important'
                                      : 'gray.50 !important'
                                  }
                                  borderColor={ws === workspaces ? 'primary.300' : 'gray.300'}
                                  fontSize={{base: '2xl', xl: '3xl'}}
                                  fontWeight="normal"
                                  color={ws === workspaces ? 'primary.500' : 'initial'}
                                  py={{base: 6, xl: 8}}
                                  px={{base: 6, xl: 7}}
                                  onClick={() => setWorkspaces(ws as number)}
                                >
                                  {ws}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </When>
                      <When condition={tab === 'payment'}>
                        <Box
                          className="flex flex-col"
                          gap={5}
                          w={{ base: 'full', lg: '55%', '2xl': '70%' }}
                        >
                          <Box
                            bgColor="gray.50"
                            p="5%"
                            rounded="xl"
                            className="flex flex-col"
                          >
                            <BillingDetails />
                          </Box>
                          <Box
                            bgColor="gray.50"
                            p="5%"
                            rounded="xl"
                            className="flex flex-col"
                          >
                            <PaymentMethod />
                          </Box>
                          <Box
                            bgColor="gray.50"
                            p="5%"
                            rounded="xl"
                            className="flex flex-col"
                          >
                            <Text>{t('coupon-code')}</Text>
                            <Text
                              className="flex justify-between"
                              color="gray.500"
                            >
                              {t('enter-your-coupon-code-here')}
                              <Switch colorScheme="primary" />
                            </Text>
                          </Box>
                        </Box>
                      </When>
                      <Box
                        className="flex flex-col"
                        maxW={{ base: '600px', lg: '480px' }}
                        minW="200px"
                        w={{ base: 'full', lg: '40%', '2xl': '27%' }}
                        top={0}
                        // ml={{ base: '0', lg: tab === 'payment' ? 'auto' : 'unset', '2xl': 'auto' }}
                      >
                        <Card variant="outline" shadow="md" ml="auto">
                          <CardHeader px={0} pb={1} borderBottom="1.5px solid" borderColor="gray.200">
                            <Text px={5} fontSize="3xl">
                              {t('tornado:your-new-plan')}
                            </Text>
                          </CardHeader>
                          <CardBody className="flex flex-col">
                            <Text className="flex items-center justify-between">
                              <span>{t('common:tornado', { plan: t(`common:${plan}`) })}</span>
                              <span>{pricesData.basePrice.toFixed(2)} USD</span>
                            </Text>
                            <Text color="gray.500">{t('tornado:unlimited-file-size')}</Text>
                            <Text color="gray.500">1 TB {t('common:storage')}</Text>
                            <Text color="gray.500">5 {t('common:workspaces')}</Text>
                            <Text className="flex items-center justify-between" mt={5}>
                              <span>{t('tornado:extra-storage')}</span>
                              <span>{pricesData.extraStoragePrice.toFixed(2)} USD</span>
                            </Text>
                            <Text color="gray.500">
                              {t('common:extra-storage', {
                                storage: storage === 'custom' ? customStorage : storage,
                              })}
                            </Text>
                            <Text className="flex items-center justify-between" mt={5}>
                              <span>{t('tornado:extra-workspaces')}</span>
                              <span>{pricesData.extraWorkspacesPrice.toFixed(2)} USD</span>
                            </Text>
                            <Text color="gray.500">{workspaces} {t('common:workspaces')}</Text>
                            <Text
                              className="flex items-center justify-between"
                              mt={5}
                              display={
                                user?.subscription?.isEligibleForProratedDiscount ? 'flex' : 'none'
                              }
                            >
                              <span>{t('tornado:prorated-discount')}</span>
                              <span>-{pricesData.proratedDiscount.toFixed(2)} USD</span>
                            </Text>
                            <Text className="flex items-center justify-between" mt={5}>
                              <span>{t('tornado:reverse-charge')} (0%)</span>
                              <span>0.00 USD</span>
                            </Text>
                            <Text
                              className="flex items-center justify-between"
                              fontSize="28px"
                              borderTop="1.5px solid"
                              borderBottom="1.5px solid"
                              borderColor="gray.300"
                              my={5}
                              py={5}
                            >
                              <span>{t('tornado:total')}</span>
                              <span>
                                {user &&
                                  !user.subscription?.isEligibleForProratedDiscount
                                  ? (
                                    pricesData.total
                                  ).toFixed(2)
                                  : pricesData.total.toFixed(2)}
                                &nbsp;USD
                              </span>
                            </Text>
                            <UnorderedList color="gray.500" spacing={2}>
                              <ListItem
                                display={
                                  user?.subscription?.isEligibleForProratedDiscount ? 'block' : 'none'
                                }
                              >
                                {t('tornado:youll-pay-1099-usd-now-line').replace('1099', pricesData.total.toFixed(2))}
                              </ListItem>
                              <ListItem>
                                {t('tornado:your-plan-is-billed-paragraph')
                                  .replace(
                                    '1099',
                                    (
                                      pricesData.total
                                    ).toFixed(2),
                                  )
                                  .replace('monatlich', t(`common:${plan}`))
                                  .replace('monthly', t(`common:${plan}`))}
                              </ListItem>
                              <ListItem>{t('tornado:you-can-cancel-any-time')}</ListItem>
                            </UnorderedList>
                            <Error message={err || paypalErr} />
                            <If condition={!isVerifying}>
                              <Then>
                                <When condition={!planId}>
                                  <Button
                                    variant="solid"
                                    colorScheme="primary"
                                    mt={2}
                                    isLoading={isLoading}
                                    onClick={() => {
                                      if (tab === 'payment') {
                                        mutate({
                                          extraStorage:
                                            storage === 'custom' ? customStorage || 0 : storage,
                                          extraWorkspaces: workspaces,
                                          subscription: plan,
                                        });
                                      } else setTab('payment');
                                    }}
                                  >
                                    {t('tornado:continue-with-this-plan')}
                                  </Button>
                                </When>
                                <When condition={planId}>
                                  <PayPalSubscribeButton
                                    planId={planId}
                                    subscriptionId={subscriptionId}
                                    onSuccess={(subscriptionID) =>
                                      verify({
                                        extraStorage:
                                          storage === 'custom' ? customStorage || 0 : storage,
                                        extraWorkspaces: workspaces,
                                        subscription: plan,
                                        paypalSubscriptionId: subscriptionID,
                                      })
                                    }
                                    onError={(e) => setPapalErr(JSON.stringify(e) || '')}
                                  />
                                </When>
                              </Then>
                              <Else>
                                <Loader />
                              </Else>
                            </If>
                          </CardBody>
                        </Card>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Else>
            </If>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
