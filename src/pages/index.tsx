import * as React from 'react';
import { Link, type HeadFC, type PageProps } from 'gatsby';
import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import {
  Box,
  Button,
  Container,
  Icon,
  Img,
  Show,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import transferPerson from '../static/transferPerson.png';
import confidentPerson from '../static/confidentPerson.png';
import pointingPerson from '../static/pointingPerson.png';
import SvgAnonymous from '../components/icons/SvgAnonymous';
import SvgSecure from '../components/icons/SvgSecure';
import SvgFast from '../components/icons/SvgFast';
import SvgUnlimited from '../components/icons/SvgUnlimited';
import Footer from '../components/Footer';
import Hero from '../components/HomeHero';

const IndexPage: React.FC<PageProps> = () => {
  const { t } = useTranslation('home');

  const features = [
    {
      icon: SvgAnonymous,
      title: t('anonymous'),
      description: t('from-a-to-z') + '. ' + t('nobody-knows-you'),
    },
    {
      icon: SvgSecure,
      title: t('secure'),
      description: t('every-nano-byte-is-encrypted'),
    },
    {
      icon: SvgFast,
      title: t('fast'),
      description: t('you-will-not-feel-the-speed'),
    },
    {
      icon: SvgUnlimited,
      title: t('unlimited'),
      description: t('more-data-more-power'),
    },
  ];
  return (
    <Layout bgColor="#fafafa">
      <Navbar />
      <Hero />
      <Box
        className="flex flex-col"
        mt={{ base: '50vh', lg: '100vh' }}
        bgColor="primary.100"
        zIndex={1}
      >
        <Container maxW="container.2xl" className="flex items-center" py="40px">
          <Stack
            spacing={9}
            flex={1}
            mx="auto"
            maxW={{ base: '80%', lg: '50%' }}
          >
            <Text
              color="primary.500"
              fontSize={{ base: '2xl', md: '5xl', xl: '71px' }}
              lineHeight={1}
            >
              {t('we-dont-transfer-we-deliver')}
            </Text>
            <Text
              color="gray.600"
              fontSize={{ base: 'xl', md: '2xl', xl: '31px' }}
              lineHeight={1.1}
              letterSpacing={1}
            >
              {t('we-dont-transfer-we-deliver-paragraph')}
            </Text>
            <Button
              as={Link}
              to="/register"
              variant="solid"
              mt={2}
              colorScheme="primary"
              alignSelf="flex-start"
              letterSpacing="1.2px"
              fontWeight={500}
            >
              {t('register-now-for-free')}
            </Button>
          </Stack>
          <Show above="lg">
            <Box
              as={Img}
              src={transferPerson}
              alt="transfer person"
              w="40%"
              aspectRatio={749 / 1015}
            />
          </Show>
        </Container>
      </Box>
      <Box
        as="section"
        className="flex flex-col"
        zIndex={1}
        bgColor="lavender-blue.200"
      >
        <Container maxW="container.2xl" className="flex items-center" py="40px">
          <Show above="lg">
            <Box
              as={Img}
              src={confidentPerson}
              alt="confident person"
              w="40%"
              aspectRatio={749 / 1015}
            />
          </Show>
          <Stack
            spacing={9}
            flex={1}
            mx="auto"
            maxW={{ base: '80%', lg: '50%' }}
            textAlign="right"
          >
            <Text
              color="lavender-blue.500"
              fontSize={{ base: '2xl', md: '5xl', xl: '71px' }}
              lineHeight={1}
            >
              {t('big-ideas-big-data')}.&nbsp;{t('not-a-big-deal-for-us')}
            </Text>
            <Text
              color="gray.600"
              fontSize={{ base: 'xl', md: '2xl', xl: '31px' }}
              lineHeight={1.1}
              letterSpacing={1}
            >
              {t('big-ideas-big-data-paragraph')}
            </Text>
            <Button
              as={Link}
              to="/tornado"
              variant="solid"
              mt={2}
              colorScheme="lavender-blue"
              letterSpacing="1.2px"
              alignSelf="flex-end"
              fontWeight={500}
            >
              {t('pay-what-you-use')}
            </Button>
          </Stack>
        </Container>
      </Box>
      <Box
        as="section"
        className="flex flex-col"
        zIndex={1}
        bgColor="powder-blue.200"
      >
        <Container maxW="container.2xl" className="flex items-center" py="40px">
          <Stack
            spacing={9}
            flex={1}
            mx="auto"
            maxW={{ base: '80%', lg: '50%' }}
          >
            <Text
              color="powder-blue.500"
              fontSize={{ base: '2xl', md: '5xl', xl: '71px' }}
              lineHeight={1}
            >
              {t('brands-on-top-to-make-impression')}
            </Text>
            <Text
              color="gray.600"
              fontSize={{ base: 'xl', md: '2xl', xl: '31px' }}
              lineHeight={1.1}
              letterSpacing={1}
            >
              {t('brands-on-top-to-make-impression-paragraph')}
            </Text>
            <Button
              as={Link}
              to="https://zoxxo.space/ads"
              variant="solid"
              mt={2}
              colorScheme="powder-blue"
              alignSelf="flex-start"
              letterSpacing="1.2px"
              fontWeight={500}
            >
              {t('advertise-with-us')}
            </Button>
          </Stack>
          <Show above="lg">
            <Box
              as={Img}
              src={pointingPerson}
              alt="pointing person"
              w="42%"
              aspectRatio={1}
            />
          </Show>
        </Container>
      </Box>
      <Box as="section" className="flex flex-col" zIndex={1} bgColor="#fafafa">
        <Container
          maxW="container.2xl"
          className="flex flex-wrap items-center justify-center"
          gap={{ base: 3, md: 6, lg: 9 }}
          py="20"
        >
          {features.map((f) => (
            <Box
              key={f.title}
              className="flex flex-col justify-center"
              rounded="xl"
              bgColor="primary.50"
              py={14}
              px={{ base: 16, md: 20, lg: '74px', xl: '88px' }}
              textAlign="center"
            >
              <Icon
                as={f.icon}
                mx="auto"
                h="40px"
                w="auto"
                maxW="60px"
                sx={{ '& path': { stroke: 'primary.500' } }}
              />
              <Text color="primary.400" fontSize="22px" mt={2}>
                {f.title}
              </Text>
              <Text maxW="150px" fontSize="17px" lineHeight={1}>
                {f.description}
              </Text>
            </Box>
          ))}
        </Container>
      </Box>
      <Footer />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <SEO />;
