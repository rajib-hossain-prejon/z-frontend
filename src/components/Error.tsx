import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

export interface IError {
  message?: string;
}

export default function Error(props: TextProps & IError) {
  return props.message ? (
    <Text
      color="red.500"
      textAlign="center"
      w="full"
      p={1}
      bgColor="red.50"
      border="1.5px solid"
      borderColor="red.200"
      rounded="sm"
      {...props}
    >
      {props.message}
    </Text>
  ) : null;
}
