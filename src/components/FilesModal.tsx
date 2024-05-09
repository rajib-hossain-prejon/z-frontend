import React, { PropsWithoutRef } from 'react';
import {
  Box,
  Button,  
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { getRelativeSize, removeHash } from '../utils';
import SvgDelete from './icons/SvgDelete';

interface IFilesDialog {
  files: { name: string; size: number }[];
  removeFile: (filename: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilesModal({
  files,
  isOpen,
  removeFile,
  onClose,
}: PropsWithoutRef<IFilesDialog>) {
  const { t } = useTranslation('uploader');
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent w="95%" minH="fit-content">
        <ModalHeader fontSize="3xl" mt="8">
          {t('added-files')}
        </ModalHeader>
        <ModalCloseButton size="lg" onClick={onClose} />
        <ModalBody py={6} letterSpacing="1.2px" pb="15%">
          <Flex direction="column">
            <Flex
              px={0}
              sx={{ fontSize: '16px' }}
              color="gray.500"
              fontWeight="semibold"
            >
              <Box px={0} textTransform="capitalize" flex="9">
                {t('name')}
              </Box>
              <Box px={0} textTransform="capitalize" textAlign="right" flex="3">
                {t('size')}
              </Box>
              <Box pr={0} w="22px">
                &nbsp;
              </Box>
            </Flex>
            {files.map((file) => (
              <Flex
                key={file.name}
                px={0}
                direction="row"
                alignItems="center"
                sx={{ fontSize: '16px' }}
                borderBottom="1px solid gray"
              >
                <Box
                  textOverflow="ellipsis"
                  overflow="hidden"
                  flex="9"
                  whiteSpace="nowrap"
                >
                  {removeHash(file.name)}
                </Box>
                <Box p={0} textAlign="right" flex="3">
                  {getRelativeSize(file.size)}
                </Box>
                <Box px={0} ml="auto" w="22px">
                  <IconButton
                    mt={1.5}
                    aria-label="remove file"
                    variant="unstyled"
                    size="sm"
                    icon={<Icon as={SvgDelete} boxSize="22px" />}
                    onClick={() => removeFile(file.name)}
                  />
                </Box>
              </Flex>
            ))}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" size="sm" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            variant="solid"
            size="sm"
            colorScheme="primary"
            ml="3"
            onClick={onClose}
          >
            {t('confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
