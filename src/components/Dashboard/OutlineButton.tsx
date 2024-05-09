import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

export default function OutlineButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      bgColor="transparent !important"
      border="1.5px solid"
      borderColor="primary.400"
      color="primary.400"
      {...props}
    >
      {props.children}
    </Button>
  );
}
