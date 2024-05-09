import React from 'react';
import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { When } from 'react-if';

interface ITopbar {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showUploadFile?: boolean;
  onUploadFiles?: (file: File[]) => void;
}

export default function Topbar({
  title,
  description,
  actions,
  showUploadFile,
  onUploadFiles,
}: ITopbar) {
  return (
    <Flex
      align="center"
      flexWrap="wrap"
      py={4}
      w="full"
      boxSizing="border-box"
      borderBottom="1.5px solid"
      borderColor={{ base: 'transparent', md: 'gray.300' }}
      gap={2}
    >
      <Text fontSize="3xl">{title}</Text>
      <When condition={Boolean(description)}>
        <Divider
          orientation="vertical"
          borderColor="gray.500"
          h="80%"
          display={{ base: 'none', lg: 'block' }}
        />
        <Text
          color="gray.300"
          order={{ base: 3, lg: 2 }}
          fontSize={{ base: 'sm', md: 'md' }}
          lineHeight={1}
          letterSpacing="normal"
        >
          {description}
        </Text>
      </When>
      <React.Fragment>{actions}</React.Fragment>
      <When condition={showUploadFile}>
        <Button
          as="label"
          htmlFor="topbar-file-input"
          variant="solid"
          colorScheme="primary"
          size="sm"
          leftIcon={<AddIcon />}
          ml="auto"
          order={{ base: 2, lg: 3 }}
        >
          Upload a file
        </Button>
        <input
          type="file"
          id="topbar-file-input"
          multiple
          onChange={(e) =>
            typeof onUploadFiles === 'function' &&
            onUploadFiles(Array.from(e.target.files || []))
          }
          style={{ display: 'none' }}
        />
      </When>
    </Flex>
  );
}
