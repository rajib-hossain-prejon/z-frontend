import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { resendEmailVerificationMail } from '../api/auth';
import Error from './Error';

export default function EmailNotVerifiedModal(props: { email: string; isOpen: boolean; onClose: () => any; }) {
  const { t } = useTranslation('auth');
  const { isLoading, mutate, error } = useMutation(
    () => resendEmailVerificationMail(props.email),
    {
      // refetch workspace to update the data
      onSuccess: () => {
        props.onClose();
      },
    },
  );
  const err = (error as any)?.message || '';

  return (
    <React.Fragment>
      <Modal isOpen={props.isOpen || isLoading} onClose={() => props.onClose()} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => props.onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('email-is-not-verified')}</Text>
            <Error message={err} />
            <Text fontSize="xl" color="gray.500">
              {t('your-email-is-not-verified-yet')}&nbsp;
              {t('please-click-on-resend-to-recieve-new-verification-link')}
            </Text>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => props.onClose()}>
                {t('common:cancel')}
              </Button>
              <Button variant="solid" size="sm" colorScheme="red" isLoading={isLoading} onClick={() => mutate()}>
                {t('resend')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>

  );
}
