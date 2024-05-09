import React from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import Topbar from '../Topbar';
import { AddIcon } from '@chakra-ui/icons';
import SvgMore from '../../icons/SvgMore';

const campaigns = [
  { name: 'Name of the campaign', id: '123', impressions: 1234.557 },
  { name: 'Name of the campaign', id: '124', impressions: 1234.557 },
  { name: 'Name of the campaign', id: '125', impressions: 1234.557 },
];

export default function CurrentCampaigns(props: RouteComponentProps) {
  return (
    <Box className="flex flex-col route" h="full" w="full">
      <Topbar
        title="Current Campaigns"
        description="Start new campaign and reach out the zoxxo users"
        actions={
          <Button
            size="sm"
            variant="solid"
            colorScheme="primary"
            order="9"
            ml="auto"
            leftIcon={<AddIcon />}
          >
            New Campaign
          </Button>
        }
      />
      <Flex
        flexWrap="wrap"
        w="full"
        pt="14"
        px={1}
        pb={4}
        gap={5}
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0 !important',
          },
        }}
      >
        {campaigns.map((camp) => (
          <Card
            shadow="md"
            w="full"
            maxW={{ base: '200px', lg: '282px' }}
            aspectRatio={282 / 326}
            key={camp.id}
          >
            <CardBody className="flex flex-col" gap={2} p={0}>
              <Box
                bgColor="lavender-blue.400"
                w="full"
                aspectRatio={282 / 237}
                roundedTop="lg"
                className="flex items-center justify-center"
                p={2}
              >
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  textAlign="center"
                  maxW="160px"
                  color="white"
                >
                  {camp.name}
                </Text>
              </Box>
              <Box
                w="full"
                flex={1}
                className="flex items-center justify-between"
                px={2}
              >
                <Text>{camp.impressions} Impressions</Text>
                <IconButton
                  variant="unstyled"
                  mt={2}
                  aria-label="share workspace"
                  icon={<Icon as={SvgMore} boxSize="24px" />}
                />
              </Box>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
