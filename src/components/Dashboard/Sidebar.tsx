import React from 'react';
import { Link } from 'gatsby';
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  List,
  ListItem,
  Progress,
  Spacer,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { When } from 'react-if';
import { useTranslation } from 'react-i18next';

import useDashboardGlobals from '../../hooks/useDashboardGlobals';
import { isBrowser } from '../../utils';

interface ISidebar {
  searchInputProps?: InputProps;
  title: string;
  titleBadge?: React.ReactNode;
  subtitle?: string;
  links: { name: string; to: string; badge?: string }[];
  storage?: {
    used: string;
    total: string;
    usedPercent: number;
  };
}

export default function Sidebar(props: ISidebar) {
  const { t } = useTranslation('dashboard');
  const ref = React.useRef<HTMLElement | null>(null);
  const { isSidebarOpen, toggleOpenSideBar } = useDashboardGlobals();
  useOutsideClick({
    ref,
    handler: () => toggleOpenSideBar(false),
  });
  const pathname = isBrowser() ? window.location.pathname : '';
  return (
    <Box
      as="aside"
      ref={ref}
      bgColor="gray.50"
      h="full"
      maxH="calc(102vh - var(--nav-height))"
      overflowY="auto"
      minW={{ base: isSidebarOpen ? '250px' : '0px', lg: '250px' }}
      w={{ base: isSidebarOpen ? '250px' : '0px', lg: '290px' }}
      transition="ease-in width 200ms"
      display="flex"
      flexDir="column"
      letterSpacing="1.2px"
      py={5}
      sx={{
        '& .dashboard-link': {
          letterSpacing: 1.2,
          w: 'full',
          px: 5,
          py: 4,
        },
        '& .dashboard-link-active': {
          bgColor: 'gray.100',
        },
        '&::-webkit-scrollbar': {
          width: '0 !important',
        },
      }}
      pos={{ base: 'fixed', lg: 'unset' }}
      zIndex={{ base: 5, lg: 'unset' }}
    >
      <Flex px={5} flexDir="column">
        <InputGroup>
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input
            type="text"
            variant="filled"
            bgColor="gray.100"
            placeholder={t('find-the-right-settings')}
            {...(props.searchInputProps || {})}
          />
        </InputGroup>
        <Divider
          borderWidth="1.7px"
          borderRight="1.7px solid"
          color="gray.600"
          my={5}
        />
      </Flex>
      <List className="flex flex-col">
        <ListItem
          className="dashboard-link flex justify-between items-center"
          fontWeight="semibold"
        >
          {props.title}
          <Box className="flex flex-col">{props.titleBadge}</Box>
        </ListItem>
        <When condition={Boolean(props.subtitle)}>
          <ListItem className="dashboard-link" fontWeight="semibold">
            {t(`dashboard:${props.subtitle}`)}
          </ListItem>
        </When>
        {props.links.map((lnk, index) => (
          <ListItem
            as={Link}
            key={lnk.name}
            to={lnk.to}
            className={`dashboard-link flex justify-between ${
              lnk.name === pathname ? 'dashboard-link-active' : ''
            }`}
            activeClassName="dashboard-link-active"
            onClick={() => toggleOpenSideBar(false)}
          >
            {lnk.name}
            <Text>{lnk.badge}</Text>
          </ListItem>
        ))}
      </List>
      <Spacer mt="10" />
      <Box className="flex flex-col" px={5}>
        <When condition={Boolean(props.storage)}>
          <Text textAlign="center" fontSize="sm" color="gray.500">
            {props.storage?.used}&nbsp;{t('out-of')}&nbsp;
            {props.storage?.total}
          </Text>
          <Progress
            colorScheme="primary"
            size="sm"
            rounded="lg"
            sx={{
              '& div': {
                rounded: 'lg',
              },
            }}
            value={props.storage?.usedPercent}
          />
        </When>
        <Divider borderWidth="1.7px" color="gray.600" my={5} />
        <Text
          as="a"
          target="_blank"
          href="https://zoxxo.space/help-center"
          textAlign="center"
        >
          {t('dashboard:help-and-inspiration')}
        </Text>
      </Box>
    </Box>
  );
}
