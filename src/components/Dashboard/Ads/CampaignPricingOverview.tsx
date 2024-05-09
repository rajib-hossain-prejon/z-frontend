import React from 'react';
import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import moment from 'moment';

import calculateCampaignPrice from '../../../utils/calculateCampaignPrice';
import { getWindow } from '../../../utils/inBrowser';
import Error from '../../Error';
import { When } from 'react-if';
import { useTranslation } from 'react-i18next';

interface ICreative {
  url: string;
  image: { name: string };
  imgUrl: string;
}

export default function CampaignPricingOverView(props: {
  title: string;
  display: ('upload-screen' | 'download-screen')[];
  isABTesting: boolean;
  creatives: ICreative[];
  startDate: string;
  endDate: string;
  isBilling: boolean;
  err?: string;
  additionalComponent?: React.ReactNode;
  isLoading?: boolean;
  hideContinue?: boolean;
  onContinue?: () => any;
}) {
  const { t } = useTranslation('ads');
  const total = calculateCampaignPrice({
    isABTesting: props.isABTesting,
    days: moment(props.endDate).diff(moment(props.startDate), 'days'),
    display:
      props.display.includes('upload-screen') &&
        props.display.includes('download-screen')
        ? 'upload-download-screen'
        : props.display[0],
  });
  return (
    <Box
      className="flex flex-wrap items-start justify-between"
      w={{ base: 'full', lg: '380px' }}
      border="2px solid"
      borderColor="gray.200"
      shadow="md"
      rounded="xl"
      py={4}
      order={{ base: 1, lg: 2 }}
      gap={2}
      pos={{ base: 'static', lg: 'sticky' }}
      top={0}
      letterSpacing="normal"
    >
      <Text fontSize="3xl" color="gray.700" w="full" pb={3} px={4}>
        {t("your-campaign")}
      </Text>
      <Divider borderColor="gray.200" borderWidth="1.5px" />
      <Box className="flex flex-col" p={4} gap={4} w="full !important">
        <Box className="flex flex-col" gap={1}>
          <Text>{t("description")}</Text>
          <Text color="gray.300">{props.title}</Text>
        </Box>
        <Box className="flex flex-col" gap={1}>
          <Text>{t("display")}</Text>
          <Text color="gray.300" textTransform="capitalize">
            {props.display.map((d) => d.split('-').join(' ')).join(', ')}
          </Text>
        </Box>
        <Box className="flex flex-col" gap={1}>
          <Text>{t("creatives")}</Text>
          <Text color="gray.300">
            {props.creatives.map((c) => c.image?.name).join(', ')}
          </Text>
        </Box>
        <Box className="flex flex-col" gap={1}>
          <Text className="flex items-center justify-between">
            <span>{t("timing")}</span>
            <span>{total.toFixed(2)} USD</span>
          </Text>
          <Text color="gray.300">
            {moment(props.startDate).format('DD.MM.YYYY')}
            &nbsp;-&nbsp;
            {moment(props.endDate).format('DD.MM.YYYY')}
          </Text>
        </Box>
        <Text className="flex items-center justify-between">
          <span>{t("reverse-charge")} (0%)</span>
          <span>0.00 USD</span>
        </Text>
        <Divider borderColor="gray.200" borderWidth="1.5px" />
        <Text fontSize="3xl" className="flex items-center justify-between">
          <span>{t("total")}</span>
          <span>
            {total.toFixed(2)}
            &nbsp;USD
          </span>
        </Text>
        <Divider borderColor="gray.200" borderWidth="1.5px" />
        <Box as="ul" color="gray.500" px={4}>
          <li>
            {t("you-will-pay")} {total.toFixed(2)} USD {t("now-for-this-campaign")}. {t("if-you-deactivate-the-campaign-before-the-set-period-the-costs-incurred-will-not-be-credited")}
          </li>
        </Box>
        <Flex gap={4} justify="space-between" flexWrap="wrap">
          {props.creatives.map((c, index) => (
            <Box
              as="a"
              href={`${getWindow()?.location.origin}/${['', 'download'][index % 2]
                }?preview-creative=${JSON.stringify({ ...c, image: c.imgUrl })}`}
              target="_blank"
              key={c.url}
              className="flex"
              rounded="lg"
              w={props.creatives.length >= 2 ? '47%' : '100%'}
              h="90px"
              border="1.5px solid gray"
              bgImage={c.imgUrl}
              bgPos="center"
              bgRepeat="no-repeat"
              bgSize="cover"
            >
              <Text m="auto">{t("preview")}</Text>
            </Box>
          ))}
        </Flex>
        <Error message={props.err} />
        <When condition={Boolean(props.additionalComponent)}>
          {props.additionalComponent}
        </When>
        <Button
          isLoading={props.isLoading}
          variant="solid"
          colorScheme="primary"
          fontWeight="normal"
          mt={4}
          display={props.hideContinue ? 'none' : 'flex'}
          onClick={props.onContinue}
        >
          {props.isBilling ? t("pay-and-launch-my-campaign") : t("continue")}
        </Button>
      </Box>
    </Box>
  );
}
