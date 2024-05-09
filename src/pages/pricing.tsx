import React from 'react';
import { HeadFC, Link } from 'gatsby';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  StackItem,
  Text,
} from '@chakra-ui/react';

import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import i18n from "./../i18n"


export default function Pricing() {

  const bigFilesFeatures = [
    {
      name: i18n.t("pricing:transfer-size-limit"),
      free: <Text>2 GB</Text>,
      tornado: <Text>{i18n.t("pricing:unlimited")}</Text>,
    },
    {
      name: i18n.t("pricing:storage"),
      free: <Text>4 GB</Text>,
      tornado: <Text>1 TB</Text>,
    },
    {
      name: 'Workspaces',
      free: <Text>1 Workspace</Text>,
      tornado: <Text>5 Workspaces</Text>,
    },
    {
      name: i18n.t("pricing:download-with-no-account"),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: i18n.t("pricing:track-downloads"),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];
  
  const brandFeatures = [
    {
      name: i18n.t("pricing:custom-download-page"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: i18n.t("pricing:wallpaper-backgrounds"),
      free: <Text>{i18n.t("pricing:advertising-(and-art)")}</Text>,
      tornado: <Text>{i18n.t("pricing:upload-your-own")}</Text>,
    },
    {
      name: i18n.t("pricing:custom-workspace-image"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];
  
  const secureTransfersFeatures = [
    {
      name: i18n.t("pricing:custom-expiration-dates"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: i18n.t("pricing:password-protected-transfers"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: i18n.t("pricing:data-encryption"),
      free: <CheckIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];
  
  const moreZoxxo = [
    {
      name: i18n.t("pricing:zoxxo-manage-(file-manager)"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
    {
      name: i18n.t("pricing:zoxxo-ads-(enhance-your-brand)"),
      free: <CloseIcon color="primary.500" boxSize="16px" />,
      tornado: <CheckIcon color="primary.500" boxSize="16px" />,
    },
  ];

  const [plan, setPlan] = React.useState('monthly');
  const {t} = useTranslation();
  return (
    <Layout bgColor="#fafafa">
      <Navbar />
      <Box
        bgColor="gray.50"
        w="full"
        mt="calc(-1 * var(--nav-height))"
        pt="var(--nav-height)"
      >
        <Container
          maxW="container.2xl"
          py="100px"
          px={{ base: 6, md: 10, lg: 12 }}
        >
          <Heading
            as="h2"
            color="primary.500"
            letterSpacing={1.2}
            fontWeight="normal"
            maxW="420px"
            fontSize={{ base: '5xl', lg: '7xl' }}
          >
            {t('pricing:your-mission-is-our-plan')}
          </Heading>
          <Flex
            flexDir={{ base: 'column', lg: 'column', xl: 'row' }}
            mt="24"
            justify="space-between"
            gap={4}
          >
            <Box className="flex flex-col">
              <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                {t('pricing:choose-your-plan')}
              </Text>
              <RadioGroup
                as={Stack}
                mt="10"
                maxW="fit-content"
                value={plan}
                onChange={(val) => setPlan(val)}
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
                  {t("pricing:monthly-billing")}
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
                {t("pricing:yearly-billing")}
                  <br />
                  <Text color="primary.500">{t('pricing:save-over-50%')}</Text>
                </Radio>
              </RadioGroup>
            </Box>
            <Flex
              flexWrap={{ base: 'wrap', xl: 'nowrap' }}
              gap={8}
              w={{ base: 'full', xl: '70%' }}
              justify="center"
              align="stretch"
            >
              <Card
                shadow="md"
                variant="outline"
                w="full"
                maxW={{ base: '420px', lg: '480px' }}
                bgColor="gray.50"
                rounded="xl"
              >
                <CardBody
                  className="flex flex-col justify-center items-center"
                  py="12"
                  letterSpacing={1.2}
                >
                  <Heading textAlign="center">{t("pricing:forever-free")}</Heading>
                  <Text textAlign="center" color="gray.600" maxW="220px" mt="3">
                  {t("pricing:upload-files-and-share-links-as-much-as-you-like")}
                  </Text>
                  <Stack spacing={0.5} my="14">
                    <Flex align="center" gap={3}>
                      <CheckIcon color="primary.500" boxSize="18px" />
                      <Text>{t("pricing:transfer-2-GB")}</Text>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <CheckIcon color="primary.500" boxSize="18px" />
                      <Text>{t("pricing:4-GB-storage")}</Text>
                    </Flex>
                  </Stack>
                  <Divider
                    borderWidth={2}
                    borderColor="gray.300"
                    maxW="300px"
                  />
                  <Text fontSize="3xl" fontWeight="bold" mt={6}>
                    0.00 USD
                  </Text>
                  <Text fontWeight="bold" my={5}>
                  {t("pricing:no-money-no-problem")}
                  </Text>
                  <Button
                    as={Link}
                    to="/register"
                    variant="solid"
                    colorScheme="primary"
                    size="lg"
                    h="50px"
                    w="full"
                    maxW="222px"
                  >
                   {t("pricing:create-account")}
                  </Button>
                </CardBody>
              </Card>
              <Card
                shadow="md"
                variant="outline"
                border="5px solid"
                borderColor="primary.500"
                w="full"
                maxW={{ base: '420px', xl: '480px' }}
                bgColor="primary.100"
                rounded="xl"
              >
                <CardBody
                  className="flex flex-col justify-center items-center"
                  py="12"
                  letterSpacing={1.2}
                >
                  <Heading
                    textAlign="center"
                    textTransform="uppercase"
                    color="primary.500"
                  >
                    Tornado
                  </Heading>
                  <Text textAlign="center" color="gray.600" maxW="200px" mt="3">
                  {t("pricing:upload-files-share-links-and-much-more")}
                  </Text>
                  <Stack spacing={0.5} my="14">
                    <Flex align="center" gap={3}>
                      <CheckIcon color="primary.500" boxSize="18px" />
                      <Text>{t("pricing:unlimited-file")}</Text>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <CheckIcon color="primary.500" boxSize="18px" />
                      <Text>{t("pricing:1-TB-storage")}</Text>
                    </Flex>
                  </Stack>
                  <Divider
                    borderWidth={2}
                    borderColor="primary.500"
                    maxW="300px"
                  />
                  <Text
                    fontSize="3xl"
                    color="primary.500"
                    fontWeight="bold"
                    textDecor="line-through"
                    mt={6}
                  >
                    {plan === 'monthly' ? '21.99' : '237.49'} USD
                  </Text>
                  <Text fontSize="3xl" color="primary.500" fontWeight="bold">
                    {(
                      Number.parseFloat(
                        plan === 'monthly' ? '21.99' : '237.49',
                      ) / 2
                    ).toFixed(2)}
                    &nbsp; USD
                  </Text>
                  <Text fontWeight="bold" my={5} color="primary.500">
                    {t("pricing:per-person-billed-yearly")}
                  </Text>
                  <Button
                    as={Link}
                    to="/signin"
                    variant="solid"
                    colorScheme="primary"
                    size="lg"
                    h="50px"
                    w="full"
                    maxW="222px"
                  >
                    {t("pricing:sign-in")}
                  </Button>
                </CardBody>
              </Card>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container
        maxW="container.2xl"
        my="230px"
        className="flex flex-col"
        letterSpacing={1.2}
        px={{ base: 6, md: 10, lg: 12 }}
      >
        <Flex w="full" mx="auto" overflowX="auto" gap={8}>
          <Box minW="650px" className="flex flex-col" flexGrow={2.3}>
            <Text fontWeight={500} fontSize="2xl">
            {t("pricing:send-big-files")}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {bigFilesFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.free}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
            {t("pricing:show-off-your-brand")}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {brandFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.free}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
            {t("pricing:secure-your-transfers")}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {secureTransfersFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.free}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Text fontWeight={500} fontSize="2xl" mt="90px">
            {t("pricing:experience-more-zoxxo")}
            </Text>
            <Stack spacing={0} w="full" mt={6}>
              {moreZoxxo.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="gray.400"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="70%">{feature.name}</Text>
                  <Text w="30%" textAlign="center">
                    {feature.free}
                  </Text>
                </StackItem>
              ))}
            </Stack>
          </Box>
          <Box
            className="flex flex-col"
            flexGrow={1}
            minW="180px"
            rounded="2xl"
            px={4}
            py={2}
            mt={6}
            bgColor="primary.100"
            border="3px solid"
            borderColor="primary.500"
          >
            <Stack spacing={0} w="full" mt={6}>
              {bigFilesFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="primary.500"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="full" textAlign="center" color="primary.500">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Box mt="calc(90px + 24px + 8px + 4px)" />
            <Stack spacing={0} w="full" mt={6}>
              {brandFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="primary.500"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="full" textAlign="center" color="primary.500">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Box mt="calc(90px + 24px + 8px + 4px)" />
            <Stack spacing={0} w="full" mt={6}>
              {secureTransfersFeatures.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="primary.500"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="full" textAlign="center" color="primary.500">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
            <Box mt="calc(90px + 24px + 8px + 4px)" />
            <Stack spacing={0} w="full" mt={6}>
              {moreZoxxo.map((feature) => (
                <StackItem
                  key={feature.name}
                  display="flex"
                  className="justify-between items-center"
                  borderBottom="1px solid"
                  borderColor="primary.500"
                  py={2}
                  _last={{ border: 0 }}
                >
                  <Text w="full" textAlign="center" color="primary.500">
                    {feature.tornado}
                  </Text>
                </StackItem>
              ))}
            </Stack>
          </Box>
        </Flex>
      </Container>
      <Footer />
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO />;
