import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export default function Layout(props: React.PropsWithChildren<BoxProps>) {
  return (
    <Box
      display="flex"
      flexDir="column"
      sx={{
        '--nav-height': '70px',
      }}
      {...props}
    />
  );
}
