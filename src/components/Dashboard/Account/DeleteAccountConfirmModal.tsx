import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';

import useAuth from '../../../hooks/useAuth';
import { deleteUser } from '../../../api/user';
import Error from '../../Error';

export default function DeleteAccountConfirmModal() {
  const { t } = useTranslation('auth');
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(
    deleteUser,
    {
      onSuccess: () => {
        logout();
        onClose();
      },
      onError: (e: any) => setErr(e.message),
    },
  );
  return (
    <React.Fragment>
      <Button
        variant="solid"
        size="sm"
        fontWeight="normal"
        alignSelf="flex-start"
        mt="3"
        onClick={onOpen}
      >
        {t('auth:delete-my-account')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={onClose} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('are-you-sure')}</Text>
            <Error message={err} />
            <Text fontSize="2xl">{t('you-will-loose-all-of-your-data')}</Text>
            <Flex align="center" justify="flex-end" gap={5} mt="10">
              <Button variant="solid" size="sm" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button variant="solid" size="sm" colorScheme="primary" isLoading={isLoading} onClick={() => mutate()}>
                {t('common:confirm')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
