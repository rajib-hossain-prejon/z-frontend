import {
  Button,
  Flex,
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
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import OutlineButton from '../OutlineButton';
import useAuth from '../../../hooks/useAuth';
import { changeUrl } from '../../../api/user';
import IUser from '../../../interfaces/IUser';
import Error from '../../Error';

export default function URLChangeModal() {
  const { t } = useTranslation('auth');
  const { user, setUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [username, setUsername] = React.useState('');

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(changeUrl, {
    onSuccess: (d) => {
      setUser({ ...(user as IUser), ...d });
      onClose();
    },
    onError: (e: any) => setErr(e.message),
  });

  const handleSumbit = () => {
    setErr('');
    mutate(username);
  };
  return (
    <React.Fragment>
      <OutlineButton fontWeight="normal" onClick={() => onOpen()}>
        {t('edit-your-url')}
      </OutlineButton>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('edit-your-url')}</Text>
            <Error message={err} />
            <Flex align="center">
              <Text>https://www.zoxxo.io/users/</Text>
              <InputGroup size="lg">
                <Input
                  size="sm"
                  type="text"
                  placeholder="john-doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace('/', '').replace(' ', '-'))}
                />
              </InputGroup>
            </Flex>
            <Flex align="center" justify="flex-end" gap={5} mt="10">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                isLoading={isLoading}
                onClick={() => handleSumbit()}
              >
                {t('common:confirm')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
