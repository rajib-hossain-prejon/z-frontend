import React, { PropsWithoutRef } from 'react';
import { Box, Button, ButtonProps, Icon } from '@chakra-ui/react';

import SvgApple from './icons/SvgApple';

export default function ContinueWithAppleButton(
  props: PropsWithoutRef<ButtonProps>,
) {
  return (
    <Button
      display="inline-flex"
      variant="unstyled"
      rounded="9999px"
      leftIcon={
        <Box
          w="40px"
          h="40px"
          bgColor="white"
          rounded="9999px"
          className="flex items-center justify-center"
          pos="absolute"
          left={0}
          top={0}
        >
          <Icon as={SvgApple} w="22px" h="22px" />
        </Box>
      }
      bgColor="gray.300"
      alignItems="center"
      pos="relative"
      maxW="400px"
      w="full"
      mx="auto"
      {...props}
    >
      Continue with Apple
    </Button>
  );
}
