import React from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createWorkspace } from '../../../api/user';
import Error from '../../Error';
import useAuth from '../../../hooks/useAuth';

export default function CreateWorkspaceModal() {
  const { t } = useTranslation('manage');
  const { refetchUser } = useAuth();
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();

  const [name, setName] = React.useState('');
  const onClose = () => {
    setName('');
    setLoading(false);
    _onClose();
  };

  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (newName: string) => createWorkspace(newName),
    {
      onSuccess: (data) => {
        refetchUser().then(() => setLoading(false)).then(() => onClose());
      },
      onError: () => setLoading(false)
    },
  );
  const err = (error as any)?.message || '';

  return (
    <React.Fragment>
      <IconButton
        aria-label="add workspace"
        boxSize="37px"
        icon={<AddIcon />}
        onClick={() => onOpen()}
      />
      <Modal
        isOpen={isOpen || isLoading}
        onClose={() => onClose()}
        isCentered
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('create-a-new-workspace')}</Text>
            <Error message={err} />
            <InputGroup size="lg">
              <Input
                type="text"
                placeholder={t('new-workspace-name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                isLoading={isLoading}
                onClick={() => {setLoading(true);mutate(name)}}
              >
                {t('create-workspace')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

    </React.Fragment>
  );
}
