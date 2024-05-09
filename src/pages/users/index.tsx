import * as React from 'react';
import { Link, HeadFC, PageProps, navigate } from 'gatsby';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';

import { SEO } from '../../components/SEO';

const Redirect = () => {
  React.useEffect(() => {
    navigate('/');
  }, []);

  return '';
};

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
        <Redirect />
      </VStack>
    </Box>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <SEO title="zoxxo" />;
