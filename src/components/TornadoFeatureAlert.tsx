import React from 'react';
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
import { Link } from 'gatsby';

import { useTranslation } from 'react-i18next';

function TornadoFeatureAlert(props: { isOpen: boolean; onClose: () => any }) {
  const { t } = useTranslation('tornado');
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size="lg" onClick={() => props.onClose()} />
        <ModalBody className="flex flex-col" gap="5" py="64px">
          <Text fontSize="3xl">{t('tornado-feature')}</Text>
          <Text fontSize="xl" color="gray.500">
            {t('you-want-to-use-tornado-plan-feature')}&nbsp;
            {t('to-use-this-feature-and-unlock-the-full-experience-you-have-to-upgrade')}
          </Text>
          <Flex align="center" justify="flex-end" gap={5} mt="6">
            <Button variant="solid" size="sm" onClick={() => props.onClose()}>
              {t('common:cancel')}
            </Button>
            <Button as={Link} to="/dashboard/plan" variant="solid" size="sm" colorScheme="red">
              {t('upgrade-now')}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TornadoFeatureAlert;
