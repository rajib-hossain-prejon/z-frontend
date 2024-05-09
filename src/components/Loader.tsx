import React from 'react';
import { Box, BoxProps, Spinner, SpinnerProps } from '@chakra-ui/react';

interface ILoader extends SpinnerProps {
  containerProps?: BoxProps;
}

export default function Loader(props: ILoader) {
  return (
    <Box className="flex" w="full" {...props.containerProps}>
      <Spinner m="auto" size="lg" {...props} />
    </Box>
  );
}
