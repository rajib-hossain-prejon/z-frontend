import React from 'react';
import { RouteComponentProps, useParams } from '@reach/router';
import { Box, Flex, Text, Switch } from '@chakra-ui/react';

import BillingDetails from '../PlanAndBilling/BillingDetails';
import PaymentMethod from '../PlanAndBilling/PaymentMethod';
import Topbar from '../Topbar';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  captureCampaignOrder,
  getCampaign,
  payCampaign,
} from '../../../api/user';
import { Else, If, Then, When } from 'react-if';
import Loader from '../../Loader';
import CampaignPricingOverView from './CampaignPricingOverview';
import { ICreative } from './NewCampaign';
import useAds from '../../../hooks/useAds';
import { navigate } from 'gatsby';
import PayPalCheckoutButton from './PayPalCheckoutButton';
import { useTranslation } from 'react-i18next';

export default function PayCampaign(props: RouteComponentProps) {
  const { t } = useTranslation('ads');
  const { updateCampaignById } = useAds();
  const id = useParams()?.id || '';

  const [orderId, setOrderId] = React.useState('');

  const { isLoading, data } = useQuery(['campaign', id], () => getCampaign(id));
  const [error, setError] = React.useState('');

  const { isLoading: isPaying, mutate } = useMutation(() => payCampaign(id), {
    onSuccess: (d) => {
      if (d.orderId) {
        setOrderId(d.orderId);
      } else {
        updateCampaignById(d._id, d);
        navigate('/ads');
      }
    },
    onError: (e: any) =>
      setError(e.message || 'Error occurred while processing'),
  });

  const { isLoading: isApproving, mutate: capture } = useMutation(
    (orderID: string) => captureCampaignOrder(id, orderID),
    {
      onSuccess: (d) => {
        updateCampaignById(d._id, d);
        navigate('/ads');
      },
      onError: (e: any) =>
        setError(e.message || 'Error occurred while approving payment'),
    },
  );

  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title={t('billing-and-payment')}
        description={t('check-or-set-your-billing-and-payment-details')}
      />
      <Box
        className="flex flex-wrap justify-between items-start no-scrollbar"
        pt="14"
        gap={4}
        maxH="full"
        overflowY="auto"
      >
        <Box
          className="flex flex-col"
          pb={8}
          gap={8}
          order={{ base: 2, lg: 1 }}
          w={{ base: 'full', lg: 'calc(100% - 400px)' }}
        >
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <BillingDetails />
          </Box>
          <Box bgColor="gray.50" p="5%" rounded="xl" className="flex flex-col">
            <PaymentMethod />
          </Box>
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <Flex justify="space-between" align="center">
              <Box className="flex flex-col" gap={3}>
                <Text>{t('coupons-code')}</Text>
                <Text color="gray.500">{t('enter-your-coupon-code-here')}</Text>
              </Box>
              <Switch colorScheme="primary" />
            </Flex>
          </Box>
        </Box>
        <If condition={isLoading}>
          <Then>
            <Loader />
          </Then>
          <Else>
            <CampaignPricingOverView
              title={data?.title || ''}
              isABTesting={data?.isABTesting || false}
              creatives={
                [data?.creative, data?.creativeABTesting]
                  .filter((c) => c?.url && c?.image)
                  .map((c) => ({
                    url: c?.url!,
                    image: {
                      name: c?.image!.split('/')[
                        c?.image.split('/').length - 1
                      ],
                    },
                    imgUrl: c?.image!,
                  })) as ICreative[]
              }
              display={data?.display as ('upload-screen' | 'download-screen')[]}
              endDate={data?.endDate || ''}
              startDate={data?.startDate || ''}
              isBilling={false}
              err={error}
              additionalComponent={
                <When condition={orderId}>
                  <PayPalCheckoutButton
                    orderId={orderId}
                    campaignId={id}
                    onSuccess={(orderID) => {
                      // capture the order on the backend
                      capture(orderID);
                    }}
                    onError={(e) => setError(JSON.stringify(e) || '')}
                  />
                </When>
              }
              hideContinue={Boolean(orderId)}
              isLoading={isPaying || isApproving}
              onContinue={() => mutate()}
            />
          </Else>
        </If>
      </Box>
    </Box>
  );
}
