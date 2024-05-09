import React from 'react';
import { RouteComponentProps, useParams } from '@reach/router';
import {
  Box,
  Button,
  Flex,
  Img,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Case, Else, If, Switch, Then, When } from 'react-if';
import moment from 'moment';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';

import Topbar from '../Topbar';
import noCapaigns from '../../../static/noCampaigns.png';
import useAds from '../../../hooks/useAds';
import { getWindow } from '../../../utils/inBrowser';

export default function AdsDashboard(props: RouteComponentProps) {
  const { t } = useTranslation('ads');
  const { allCampaigns } = useAds();
  const status: string = useParams()?.status || '';

  const campaigns = React.useMemo(
    () =>
      (allCampaigns || []).filter((camp) => {
        const today = moment().format('YYYY-MM-DD');
        if (status === 'current-campaigns') {
          return !moment(camp.endDate).isBefore(today);
        } else if (status === 'past-campaigns') {
          return moment(camp.endDate).isBefore(today);
        } else return true;
      }),
    [status, allCampaigns],
  );
  const [currentCampaignId, setCurrentCampaignId] = React.useState('');
  const campaign = campaigns.find((c) => c._id === currentCampaignId);
  let invoiceLink = '';
  if (campaign?.payment) {
    if (campaign.payment.invoiceLink) {
      invoiceLink = campaign.payment.invoiceLink;
    } else if (campaign.payment.status !== 'succeeded') {
      invoiceLink = `/ads/campaigns/${campaign?._id}/pay`;
    }
  } else if (campaign) {
    invoiceLink = `/ads/campaigns/${campaign?._id}/pay`;
  }

  const totalImpressions =
    campaign?.impressions?.reduce(
      (sum = 0, imp) => imp.totalImpressions + sum,
      0,
    ) || 0;
  const totalClicks =
    campaign?.impressions?.reduce((sum = 0, imp) => imp.totalClicks + sum, 0) ||
    0;

  React.useEffect(() => {
    if (campaigns.length) {
      setCurrentCampaignId(campaigns[0]._id);
    }
  }, [campaigns]);
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title={status ? t(`ads:${status}`) : t("dashboard:dashboard")}
        description={t('dashboard:ads-description-line')}
        actions={
          <Button
            as={Link}
            to="/ads/new-campaign"
            size="sm"
            variant="solid"
            colorScheme="primary"
            order="9"
            ml="auto"
            leftIcon={<AddIcon />}
          >
            {t("new-campaign")}
          </Button>
        }
      />
      <Switch>
        <Case condition={campaigns.length === 0}>
          <Box
            className="flex flex-col items-center justify-center"
            w="full"
            h="full"
            p={5}
          >
            <Img src={noCapaigns} alt="no campaigns" maxW="50%" w="full" />
            <Text fontSize="xl" textAlign="center" mt="10" color="gray.500">
              {t("you-still-have-no-campaigns")}
            </Text>
          </Box>
        </Case>
        <Case condition={campaigns.length > 0}>
          <Box
            className="flex flex-col no-scrollbar"
            maxH="full"
            pt="14"
            pb={8}
            overflowY="auto"
          >
            <Flex justify="space-between">
              <Box className="flex flex-col">
                <Text>{t("campaigns")}</Text>
                <Text fontSize="smaller" color="gray.500" mt={3}>
                  {t("you-can-track-and-trace-your-campaigns")}
                </Text>
              </Box>
              <Select
                variant="outline"
                maxW="fit-content"
                minW="20%"
                value={currentCampaignId}
                onChange={(e) => setCurrentCampaignId(e.target.value)}
              >
                <option value="" disabled>
                  {t("select-campaign")}
                </option>
                {campaigns.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                    style={{
                      color:
                        c.payment?.status !== 'succeeded'
                          ? 'orange'
                          : 'inherit',
                    }}
                  >
                    {c.title}
                  </option>
                ))}
              </Select>
            </Flex>
            <Box
              className="flex flex-wrap items-center"
              pt={12}
              gap="3"
              sx={{
                '& .card': {
                  rounded: 'xl',
                  bgColor: 'gray.100',
                  display: 'flex',
                  flexDir: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: 282 / 246,
                  minW: {
                    base: '170px',
                    xl: '215px',
                    '2xl': '282px',
                  },
                  p: 4,
                  textAlign: 'center',
                },
                '& .card .title': {
                  fontSize: { base: 'lg', md: 'xl', lg: 'xl', xl: '3xl' },
                  lineHeight: 1,
                },
                '& .card .subtitle': {
                  fontSize: { base: 'xs', lg: 'sm', xl: 'md' },
                  color: 'gray.700',
                },
              }}
            >
              <Box className="card">
                <Text className="title">{totalImpressions}</Text>
                <Text className="subtitle">{t("total-impressions")}</Text>
              </Box>
              <Box className="card">
                <Text className="title">{totalClicks}</Text>
                <Text className="subtitle">{t("total-clicks")}</Text>
              </Box>
              <Box className="card">
                <Text className="title">{((campaign?.payment?.price || 0) / totalClicks).toFixed(2)}&nbsp;USD</Text>
                <Text className="subtitle">{t("cost-per-click")}</Text>
              </Box>
              <Box className="card">
                <Text className="title">
                  {totalImpressions
                    ? (totalClicks / totalImpressions).toFixed(2)
                    : 0}
                  %
                </Text>
                <Text className="subtitle">{t("click-through-rate")}</Text>
              </Box>
              <Box className="card">
                <Text className="title">
                  {(campaign?.payment?.price || 0).toFixed(2)}&nbsp;USD
                </Text>
                <Text className="subtitle">{t("total-campaign-cost")}</Text>
              </Box>
            </Box>
            <Box
              className="flex flex-wrap justify-between items-start"
              mt={3}
              gap={2}
            >
              <Box
                rounded="xl"
                bgColor="gray.50"
                p="5%"
                className="flex flex-col"
                w={{ base: 'full', lg: 'calc(100% - 300px)' }}
                order={{ base: 2, lg: 1 }}
              >
                <Text>{t("campaign-in-detail")}</Text>
                <TableContainer maxW="full" className="no-scrollbar">
                  <Table
                    variant="simple"
                    sx={{
                      '& td, & th': {
                        borderColor: 'gray.300',
                      },
                    }}
                  >
                    <Thead
                      sx={{
                        '& th': {
                          color: 'gray.600',
                          textTransform: 'capitalize',
                          fontWeight: 'normal',
                          fontSize: 'md',
                        },
                      }}
                    >
                      <Tr>
                        <Th>{t("common:date")}</Th>
                        <Th textAlign="center">{t("impressions")}</Th>
                        <Th textAlign="center">{t("clicks")}</Th>
                        <Th textAlign="right">CTR</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <If condition={campaign?.impressions.length}>
                        <Then>
                          {campaign?.impressions.map((imp, index) => (
                            <Tr key={index}>
                              <Td>
                                {moment(imp.date, 'YYYY-MM-DD').format(
                                  'D MMMM YYYY',
                                )}
                              </Td>
                              <Td textAlign="center">{imp.totalImpressions}</Td>
                              <Td textAlign="center">{imp.totalClicks}</Td>
                              <Td isNumeric>
                                {totalImpressions
                                  ? (
                                    imp.totalClicks / imp.totalImpressions
                                  ).toFixed(2)
                                  : 0}
                                %
                              </Td>
                            </Tr>
                          ))}
                        </Then>
                        <Else>
                          <Tr>
                            <Td colSpan={4} textAlign="center">
                              {t("no-impressions-yet")}
                            </Td>
                          </Tr>
                        </Else>
                      </If>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              <Box
                className="flex flex-wrap items-start justify-between"
                w={{ base: 'full', lg: '282px' }}
                bgColor="gray.50"
                rounded="xl"
                p={4}
                order={{ base: 1, lg: 2 }}
                gap={4}
              >
                <Text
                  fontSize="xl"
                  borderBottom="1.5px solid"
                  borderColor="gray.500"
                  color="gray.700"
                  w="full"
                  pb={3}
                  mb={2}
                >
                  {t("your-campaign")}
                </Text>
                <When condition={Boolean(invoiceLink)}>
                  <Button
                    as={Link}
                    to={invoiceLink}
                    variant="outline"
                    colorScheme="orange"
                    size="sm"
                  >
                    {t("pending-payment")}
                  </Button>
                </When>
                <Box className="flex flex-col" gap={1}>
                  <Text>{t("description")}</Text>
                  <Text color="gray.300">{campaign?.title}</Text>
                </Box>
                <Box className="flex flex-col" gap={1}>
                  <Text>{t("display")}</Text>
                  <Text color="gray.300" textTransform="capitalize">
                    {campaign?.display.map((d) => `${d.split('-').join(' ')}, `)}
                  </Text>
                </Box>
                <Box className="flex flex-col" gap={1}>
                  <Text>{t("timing")}</Text>
                  <Text color="gray.300">
                    {moment(campaign?.startDate).format('DD.MM.YYYY')}
                    &nbsp;-&nbsp;
                    {moment(campaign?.endDate).format('DD.MM.YYYY')}
                  </Text>
                </Box>
                <Flex
                  gap={2}
                  align="center"
                  justify="space-between"
                  flexWrap="wrap"
                >
                  {[campaign?.creative, campaign?.creativeABTesting]
                    .filter((c) => c?.url && c?.image)
                    .map((cr, index) => (
                      <Button
                        as="a"
                        href={`${getWindow()?.location.origin}/${['', 'download'][index % 2]
                          }?preview-creative=${JSON.stringify(cr)}`}
                        target="_blank"
                        key={index}
                        variant="outline"
                        size="sm"
                        fontWeight="normal"
                        mt={4}
                        minW="fit-content"
                      >
                        {t("common:preview")}
                      </Button>
                    ))}
                </Flex>
              </Box>
            </Box>
          </Box>
        </Case>
      </Switch>
    </Box>

  );
}
