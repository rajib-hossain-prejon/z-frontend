import * as React from 'react';
import { Link, HeadFC, PageProps } from 'gatsby';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';

import { SEO } from '../components/SEO';

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Box
      w="98vw"
      h="50vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack>
        {/* <Heading mx="auto">404, Not Found</Heading>
        <Button mx="auto" variant="link" as={Link} to="/">
          Go to home
        </Button> */}
      </VStack>
    </Box>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <SEO title="zoxxo" />;
