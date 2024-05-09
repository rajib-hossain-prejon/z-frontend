import React from 'react';
import {
  Box,
  Button,
  Container,
  Icon,
  Img,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import zoxxoLogo from '../static/zoxxo_WHT_full.png';
import { Link } from 'gatsby';
import SvgInstagram from './icons/SvgInstagram';
import SvgFacebook from './icons/SvgFacebook';
import SvgTwitter from './icons/SvgTwitter';
import LanguagesModal from './LanguagesModal';
import i18n, { langMap } from '../i18n';

export default function Footer() {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // const { language } = useLanguage();

  // links
  const productLinks = [
    { name: t('pricing'), link: '/pricing' },
    { name: t('tornado'), link: '/tornado' },
    { name: t('sign-up'), link: '/register' },
    { name: t('sign-in'), link: '/signin' },
  ];

  const whoWeAreLinks = [
    { name: t('platform'), link: 'https://zoxxo.space/platform' },
    { name: t('advertising'), link: 'https://zoxxo.space/ads' },
    { name: t('brand'), link: 'https://zoxxo.space/brand' },
  ];

  const exploreLinks = [
    { name: t('help-center'), link: 'https://zoxxo.space/help-center' },
    {
      name: t('terms-of-service'),
      link: 'https://zoxxo.space/terms-of-service',
    },
    { name: t('privacy-policy'), link: 'https://zoxxo.space/privacy-policy' },
  ];
  // ---------
  return (
    <Box bgColor="#161616" zIndex={1}>
      <Container
        maxW="container.2xl"
        className="flex flex-wrap"
        py="24"
        color="white"
        gap={12}
      >
        <Box
          display="flex"
          flexDir={{ base: 'row', lg: 'column' }}
          justifyContent={{ base: 'space-between', lg: 'flex-start' }}
          alignItems={{ base: 'flex-start', lg: 'flex-start' }}
          flex={{ base: 'unset', lg: 1 }}
          w={{ base: '100vw', lg: 'auto' }}
          flexBasis={{ base: 'unset', lg: 'min(200px, 100%)' }}
        >
          <Box
            as={Img}
            src={zoxxoLogo}
            alt="zoxxo logo"
            w="100px"
            aspectRatio={70 / 78}
          />
          <Button
            bgColor="#252525 !important"
            colorScheme="whiteAlpha"
            w="full"
            maxW={{ base: '50%', lg: '195px' }}
            fontSize="xl"
            h="60px"
            textAlign="left"
            justifyContent="space-between"
            fontWeight="normal"
            mt={{ base: '0', lg: '14' }}
            rightIcon={<ChevronDownIcon />}
            onClick={() => onOpen()}
          >
            {langMap[i18n.language]}
          </Button>
          <LanguagesModal isOpen={isOpen} onClose={onClose} />
        </Box>
        <Box className="flex flex-col" flex={1} flexBasis="min(200px, 100%)">
          <Text fontSize="3xl" textTransform="uppercase" mb="10">
            {t('product')}
          </Text>
          {productLinks.map((lnk) => (
            <Text
              as={Link}
              to={lnk.link}
              fontSize="xl"
              key={lnk.name}
              mb="22px"
              letterSpacing={1.2}
              maxW="fit-content"
            >
              {lnk.name}
            </Text>
          ))}
        </Box>
        <Box className="flex flex-col" flex={1} flexBasis="min(200px, 100%)">
          <Text fontSize="3xl" textTransform="uppercase" mb="10">
            {t('who-we-are')}
          </Text>
          {whoWeAreLinks.map((lnk) => (
            <Text
              as="a"
              href={lnk.link}
              target="_blank"
              fontSize="xl"
              key={lnk.name}
              mb="22px"
              letterSpacing={1.2}
              maxW="fit-content"
            >
              {lnk.name}
            </Text>
          ))}
        </Box>
        <Box className="flex flex-col" flex={1} flexBasis="min(200px, 100%)">
          <Text fontSize="3xl" textTransform="uppercase" mb="10">
            {t('explore')}
          </Text>
          {exploreLinks.map((lnk) => (
            <Text
              as="a"
              href={lnk.link}
              target="_blank"
              fontSize="xl"
              key={lnk.name}
              mb="22px"
              letterSpacing={1.2}
              maxW="fit-content"
            >
              {lnk.name}
            </Text>
          ))}
        </Box>
        <Box
          className="flex items-center flex-wrap"
          w="full"
          borderTop="1px solid gray"
          pt={14}
          gap={12}
        >
          <Box as="a" target='_blank' href="www.instagram.com" display="block" w="31px">
            <Icon as={SvgInstagram} w="full" h="full" />
          </Box>
          <Box as="a" target='_blank' href="www.facebook.com" display="block" w="31px">
            <Icon as={SvgFacebook} w="full" h="full" />
          </Box>
          <Box as="a" target='_blank' href="www.twitter.com" display="block" w="31px">
            <Icon as={SvgTwitter} w="full" h="full" />
          </Box>
          <Text color="gray.400" ml="auto">
            &copy;2022 zoxxo
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
