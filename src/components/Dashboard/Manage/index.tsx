import React, { PropsWithChildren } from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps, Router } from '@reach/router';
import { Box, Card, CardBody, Flex, Text } from '@chakra-ui/react';

import Topbar from '../Topbar';

const WorkspaceRoute = (props: PropsWithChildren<RouteComponentProps>) => (
  <>
    <Topbar title="Private Workspace" />
    <Flex flexWrap="wrap" w="full" mt="14" gap={5} overflowY="auto">
      <Card
        shadow="md"
        w="full"
        maxW={{ base: '200px', lg: '282px' }}
        aspectRatio={282 / 326}
      >
        <CardBody
          className="flex flex-col items-center justify-center"
          gap={2}
          bgColor="lavender-blue.400"
          rounded="lg"
        >
          <Text textTransform="uppercase" fontSize="3xl" color="gray.600">
            Private WS
          </Text>
        </CardBody>
      </Card>
    </Flex>
  </>
);

export default function Manage(props: RouteComponentProps) {
  const workspaces = [
    { title: 'Private workspace', id: '1245', uploads: 3 },
    { title: 'My Workspace', id: '1234', uploads: 1 },
  ];
  return (
    <Box
      className="flex flex-col route"
      h="full"
      w="full"
      overflowY="auto"
      maxH="full"
    >
      <Router basepath="/workspaces">
        {workspaces.map((ws, index) => (
          <WorkspaceRoute default={index === 0} path={ws.id} />
        ))}
      </Router>
    </Box>
  );
}
