import React from 'react';
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import logo from '../../static/zoxxo_CLR.png';
import useDashboardGlobals from '../../hooks/useDashboardGlobals';
import useAuth from '../../hooks/useAuth';

interface IDashboardNavbar {
  section: 'box' | 'manage' | 'ads';
}

export default function DashboardNavbar(props: IDashboardNavbar) {
  const { t } = useTranslation('dashboard');
  const { logout, user } = useAuth();
  const toggleOpenSideBar = useDashboardGlobals(
    (state) => state.toggleOpenSideBar, // only selecting what is needed to prevent extra renders
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = React.useState(false);

  const handleLogout = () => {
    setLoading(true);
    logout().finally(() => setLoading(false));
  };

  return (
    <Box
      as="nav"
      py={{ base: '2' }}
      px="5"
      className="flex items-center justify-between"
      shadow="md"
      zIndex={10}
    >
      <Flex align="center" gap={4}>
        <IconButton
          aria-label="open sidebar"
          variant="unstyled"
          icon={<HamburgerIcon boxSize="36px" />}
          size="lg"
          display={{ base: 'flex', lg: 'none' }}
          onClick={() => toggleOpenSideBar()}
        />
        <Link to="/" className='flex items-center'>
          <Box as={Img} src={logo} alt="logo" w="38px" />
          <Text
            color="gray.700"
            letterSpacing="1.2px"
            fontSize="3xl"
            textTransform="uppercase"
            ml={4}
          >
            {props.section}
          </Text>
        </Link>
      </Flex>
      <Menu
        autoSelect={false}
        colorScheme="white"
        isOpen={isLoading || isOpen}
        onClose={onClose}
      >
        <MenuButton
          as={IconButton}
          bgColor="transparent !important"
          icon={
            <Avatar
              name={user?.fullName}
              src={
                process.env.GATSBY_BACKEND_URL && user?.avatar
                  ? `${process.env.GATSBY_BACKEND_URL}/uploads/images/${user?.avatar}`
                  : 'https://www.dummyimage.com/100x100/2B2B2B/fff'
              }
              bgColor="gray.300"
            />
          }
          onClick={() => onOpen()}
        />
        <MenuList
          borderColor="gray.400"
          minW="fit-content"
          w="310px"
          maxW={{ base: '80vw', lg: '32vw' }}
          sx={{
            '& .item': {
              bgColor: 'white !important',
              maxW: { base: '78vw', lg: '30vw' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-all',
            },
          }}
        >
          <MenuItem
            as="div"
            className="item"
            icon={
              <Avatar
                name={user?.fullName}
                src={
                  process.env.GATSBY_BACKEND_URL && user?.avatar
                    ? `${process.env.GATSBY_BACKEND_URL}/uploads/images/${user?.avatar}`
                    : 'https://www.dummyimage.com/100x100/2B2B2B/fff'
                }
                bgColor="gray.300"
              />
            }
          >
            <Flex flexDir="column" lineHeight={1}>
              <Text>{user?.username}</Text>
              <Text _firstLetter={{ textTransform: 'lowercase' }}>
                {user?.email}
              </Text>
            </Flex>
          </MenuItem>
          <MenuDivider borderColor="gray.400" />
          <MenuItem as="div" className="item" textTransform="uppercase" fontWeight="bold">
            {t('profile')}
          </MenuItem>
          <MenuItem as={Link} to="/dashboard">
            Dashboard
          </MenuItem>
          <MenuDivider borderColor="gray.400" />
          <MenuItem as="div" className="item" textTransform="uppercase" fontWeight="bold">
            {t('tools')}
          </MenuItem>
          <MenuItem
            as={Link}
            to={`/manage/${user?.workspaces[0]?._id}`}
            className="item"
          >
            zoxxo MANAGE
          </MenuItem>
          <MenuItem as={Link} to="/ads" className="item">
            zoxxo ADS
          </MenuItem>
          <MenuItem
            className="item"
            as="a"
            target="_blank"
            href="https://zoxxo.space/help-center"
          >
            {t('help-center')}
          </MenuItem>
          <MenuDivider borderColor="gray.400" />
          <MenuItem
            className="item"
            color="red.500"
            disabled={isLoading}
            onClick={() => handleLogout()}
          >
            {t('log-out')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
