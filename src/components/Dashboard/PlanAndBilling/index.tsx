import React from 'react';
import { Link } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import { useTranslation } from 'react-i18next';

import Topbar from '../Topbar';
import Announcement from '../Announcement';
import OutlineButton from '../OutlineButton';
import SvgDownload from '../../icons/SvgDownload';
import useAuth from '../../../hooks/useAuth';
import BillingDetails from './BillingDetails';
import PaymentMethod from './PaymentMethod';
import UpgradePlan from './UpgradePlan';
import UploadFiles from '../Manage/UploadFiles';
import { WarningIcon } from '@chakra-ui/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { downgradePlan, getInvoices } from '../../../api/user';
import moment from 'moment';

export default function PlanAndBilling(props: RouteComponentProps) {
  const { t } = useTranslation('pricing');
  const { user, refetchUser } = useAuth();
  const toast = useToast();

  const { isLoading, mutate } = useMutation(() => downgradePlan(), {
    onSuccess: () => {
      toast({
        colorScheme: 'green',
        title: t('downgrade-successful'),
        description:
          t('downgrade-description'),
        duration: 10 * 1000,
        position: 'top-right',
        variant: 'solid',
      });
      refetchUser();
    },
    onError: (e: any) =>
      toast({
        colorScheme: 'red',
        title: 'Downgrade Failed',
        description: e.message || 'An error occured, could not downgrade',
        duration: 10 * 1000,
        position: 'top-right',
        variant: 'solid',
      }),
  });

  const [isSeeMoreInvoices, setSeeMoreInvoices] = React.useState(false);
  const { isLoading: isGettingInvoices, data: invoices } = useQuery(['invoices', user?._id], () => getInvoices());

  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title={t('dashboard:plan-and-billing')}
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
          gap={5}
          h="fit-content"
        >
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <Text>
              <b>zoxxo&nbsp;</b>
              <If condition={!Boolean(user?.subscription?.type)}>
                <Then>
                  <Box as="span" fontWeight="bold" color="gray.500">
                    {t('free')}
                  </Box>
                  <Text as="span" color="gray.500" mt={2}>
                    <br />
                    {t('simple-plan')}
                  </Text>
                </Then>
                <Else>
                  <Box as="span" fontWeight="bold" color="primary.500">
                    TORNADO
                  </Box>
                  <If condition={user?.subscription?.status === 'downgrading'}>
                    <Then>
                      <Box as="span" color="gray.500" mt={2}>
                        <br />
                        {t('your-plan-will-downgrade-to-free-plan', {date: user?.subscription?.downgradesAt})}
                        <br />
                        {t('you-can-continue-with-tornado-plan')}
                      </Box>
                    </Then>
                    <Else>
                      <Box as="span" color="gray.500" mt={2}>
                        <br />
                        {t('powerful-plan-with-storage-upgrade-option')}
                      </Box>
                    </Else>
                  </If>
                </Else>
              </If>
            </Text>
            <Flex align="center" gap={5} mt={8} flexWrap="wrap">
              <Switch>
                <Case condition={['active', 'incomplete', 'past_due'].includes(user?.subscription?.status || '')}>
                  <OutlineButton
                    fontWeight="normal"
                    isLoading={isLoading}
                    onClick={() => mutate()}
                  >
                    {t('downgrade-to-free-plan')}
                  </OutlineButton>
                  <When condition={Boolean(user?.subscription?.invoiceLink)}>
                    <Button
                      as="a"
                      target="_blank"
                      href={user?.subscription?.invoiceLink}
                      variant="outline"
                      colorScheme="yellow"
                      leftIcon={<WarningIcon />}
                    >
                      {t('pending-invoice')}
                    </Button>
                  </When>
                </Case>
                <Case condition={user?.subscription?.status === 'downgrading' || !Boolean(user?.subscription?.type)}>
                  <UpgradePlan />
                </Case>
              </Switch>
            </Flex>
          </Box>
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <BillingDetails />
          </Box>
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <PaymentMethod />
          </Box>
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <Text>{t('invoices')}</Text>
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
            <If condition={Boolean(invoices && invoices.length)}>
              <Then>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th color="gray.300" textTransform="initial">
                          {t('common:date')}
                        </Th>
                        <Th
                          color="gray.300"
                          textTransform="initial"
                          textAlign="center"
                        >
                          {t('common:plan')}
                        </Th>
                        <Th
                          color="gray.300"
                          textTransform="initial"
                          textAlign="center"
                        >
                          {t('common:amount')}
                        </Th>
                        <Th
                          color="gray.300"
                          textTransform="initial"
                          textAlign="center"
                        >
                          {t('common:download')}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        invoices?.slice(0, isSeeMoreInvoices ? undefined : 3).map((inv) => (
                          <Tr>
                            <Td>{moment(inv.datePaid).format('DD MMM YYYY')}</Td>
                            <Td textAlign="center">{inv.plan}</Td>
                            <Td textAlign="center">{inv.amount}&nbsp;{inv.currency.toUpperCase()}</Td>
                            <Td className="flex justify-center">
                              <IconButton
                                as="a"
                                href={`${process.env.GATSBY_BACKEND_URL}/users/invoices/${inv._id}/download`}
                                target="_blank"
                                aria-label='download'
                                variant="unstyled"
                                mt="1.5"
                                icon={
                                  <Icon
                                    as={SvgDownload}
                                    boxSize="24px"
                                    m="auto"
                                    color="primary.500"
                                  />
                                }
                              />
                            </Td>
                          </Tr>
                        ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
                <When condition={!isSeeMoreInvoices}>
                  <Button
                    variant="unstyled"
                    color="primary.400"
                    mx="auto"
                    fontWeight="normal"
                    onClick={() => setSeeMoreInvoices(true)}
                  >
                    {t('common:see-more')}
                  </Button>
                </When>
              </Then>
              <Else>
                <Text color="gray.500" my={2}>
                  {t('no-invoices-yet')}
                </Text>
              </Else>
            </If>
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
