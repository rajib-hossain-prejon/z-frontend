import React from 'react';
import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Img,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import zoxxoLogo from '../static/zoxxo_CLR.png';
import useAuth from '../hooks/useAuth';
import { Else, If, Then } from 'react-if';
import useHeroSectionStore from '../hooks/useHeroSectionStore';

const MobileMenu = (props: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navItems = [
    { name: t('pricing'), link: '/pricing' },
    { name: t('tornado'), link: '/tornado' },
  ];
  let items = [];
  if (user) {
    items = [
      { name: t('manage'), link: '/manage' },
      { name: t('dashboard'), link: '/dashboard' },
    ];
  } else {
    items = [
      { name: t('sign-up'), link: '/register' },
      { name: t('sign-in'), link: '/signin' },
    ];
  }
  return (
    <Drawer placement="left" isOpen={props.isOpen} onClose={props.onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader fontWeight="medium">
          <Box className="flex items-center" gap={6}>
            <Box
              as={Link}
              to="/"
              aspectRatio="45 / 39"
              w="45px"
              className="link"
            >
              <Box as={Img} src={zoxxoLogo} alt="zoxxo logo" w="45px" />
            </Box>
          </Box>
        </DrawerHeader>
        <DrawerCloseButton onClick={props.onClose} />
        <DrawerBody as={VStack} align="flex-start" spacing={6} pt="60px">
          {[...navItems, ...items].map((item) => (
            <Text
              as={Link}
              to={item.link}
              key={item.name}
              textAlign="center"
              fontSize="xl"
              lineHeight={1}
              alignSelf="center"
            >
              {item.name}
            </Text>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const Navbar = React.forwardRef<React.PropsWithRef<HTMLDivElement>>(
  function NavbarComponent(props, ref) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { reset } = useHeroSectionStore();
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
      <Box
        as="nav"
        ref={ref}
        bg="transparent"
        backdropFilter="blur(75px) contrast(1.2)"
        className="flex items-center"
        h="var(--nav-height)"
        pos="sticky"
        top={0}
        zIndex={100}
      >
        <Container as={Flex} maxW="container.2xl" px={5}>
          <Flex
            w="full"
            justify="space-between"
            align="center"
            display={{ base: 'flex', md: 'none' }}
          >
            <Box
              as={Link}
              to="/"
              aspectRatio="45 / 39"
              w="45px"
              // reset hero section uploader
              onClick={() => {
                console.log('clicked');
                reset();
              }}
              className="link"
            >
              <Box as={Img} src={zoxxoLogo} alt="zoxxo logo" w="full" />
            </Box>
            <IconButton
              aria-label="menu"
              icon={<HamburgerIcon boxSize="30px" />}
              variant="unstyled"
              onClick={onOpen}
            />
          </Flex>
          <MobileMenu isOpen={isOpen} onClose={onClose} />
          <Stack
            display={{ base: 'none', md: 'flex' }}
            direction="row"
            alignItems="center"
            spacing="10"
            mx="auto"
            sx={{
              '& .link': {
                textAlign: 'center',
                pt: 0.5,
                lineHeight: 1,
                letterSpacing: 0.5,
                fontWeight: 'bold',
                // mixBlendMode: 'difference',
              },
            }}
          >
            <Text as={Link} to="/pricing" className="link">
              {t('pricing')}
            </Text>
            <Text as={Link} to="/tornado" className="link">
              {t('tornado')}
            </Text>
            <Box
              as={Link}
              to="/"
              aspectRatio={{ base: '45 / 39', lg: '70 / 61' }}
              w="45px"
              className="link"
              // reset hero section uploader
              onClick={() => {
                console.log('clicked');
                reset();
              }}
            >
              <Box as={Img} src={zoxxoLogo} alt="zoxxo logo" w="full" />
            </Box>
            <If condition={!user}>
              <Then>
                <Text as={Link} to="/register" className="link">
                  {t('sign-up')}
                </Text>
                <Text as={Link} to="/signin" className="link">
                  {t('sign-in')}
                </Text>
              </Then>
              <Else>
                <Text
                  as={Link}
                  to={`/manage/${user?.workspaces[0]?._id}`}
                  border="1.5px solid"
                  rounded="999px"
                  p="8px 12px !important"
                  lineHeight={1}
                  className="link flex items-center justify-center"
                >
                  {t('manage')}
                </Text>
                <Text
                  as={Link}
                  to="/dashboard"
                  border="1.5px solid"
                  rounded="999px"
                  p="8px 12px !important"
                  lineHeight={1}
                  className="link flex items-center justify-center"
                >
                  {t('dashboard')}
                </Text>
              </Else>
            </If>
          </Stack>
        </Container>
      </Box>
    );
  },
);

export default Navbar;
