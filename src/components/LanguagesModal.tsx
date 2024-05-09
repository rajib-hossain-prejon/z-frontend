import React, { PropsWithoutRef } from 'react';
import {
  Box,
  Button,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import logo from '../static/zoxxo_CLR.png';
import { useLanguage } from '../i18n';

interface ILanguagesModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguagesModal({
  isOpen,
  onClose,
}: PropsWithoutRef<ILanguagesModal>) {
  const { language: currentLanguage, changeLanguage } = useLanguage();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent w="95%" minH="fit-content">
        <ModalHeader
          fontSize="3xl"
          mt="8"
          className="flex flex-col items-center justify-center"
        >
          <Box as={Img} src={logo} alt="zoxxo logo" w="70px" />
          <Text mt="6">Choose your language</Text>
        </ModalHeader>
        <ModalCloseButton size="lg" onClick={() => onClose()} />
        <ModalBody
          as={SimpleGrid}
          columns={3}
          justifyContent="space-around"
          rowGap="35px"
          px="5%"
          pb="35px"
        >
          {[
            { name: 'English', key: 'en' },
            { name: 'Deutsch', key: 'de' },
          ].map((lang) => (
            <Button
              variant="ghost"
              _hover={{
                bgColor:
                  lang.name === currentLanguage.name
                    ? 'transparent'
                    : 'gray.100',
              }}
              fontWeight="semibold"
              key={lang.name}
              my="2%"
              w="130px"
              onClick={() => changeLanguage(lang.key)}
              leftIcon={
                <CheckIcon
                  color={
                    lang.name === currentLanguage.name
                      ? 'green.500'
                      : 'transparent'
                  }
                />
              }
            >
              {lang.name}
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
