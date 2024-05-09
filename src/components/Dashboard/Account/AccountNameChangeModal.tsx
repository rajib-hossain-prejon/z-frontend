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
import OutlineButton from '../OutlineButton';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import useAuth from '../../../hooks/useAuth';
import { changeUsername } from '../../../api/user';
import IUser from '../../../interfaces/IUser';
import Error from '../../Error';

export default function AccountNameChangeModal() {
  const { t } = useTranslation('auth');
  const { user, setUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [username, setUsername] = React.useState('');

  const [err, setErr] = React.useState('');
  const { isLoading, mutate } = useMutation(
    (newUsername: string) => changeUsername(newUsername),
    {
      onSuccess: (d) => {
        setUser({ ...(user as IUser), ...d });
        onClose();
      },
      onError: (e: any) => setErr(e.message),
    },
  );

  const handleSumbit = () => {
    setErr('');
    mutate(username);
  };
  return (
    <React.Fragment>
      <OutlineButton
        variant="unstyled"
        px={2}
        fontWeight="normal"
        onClick={() => onOpen()}
      >
        {t('change-account-name')}
      </OutlineButton>
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
            <Text fontSize="3xl">{t('change-account-name')}</Text>
            <Error message={err} />
            <InputGroup size="lg">
              <Input
                type="text"
                placeholder={t('common:username')}
                value={username}
                onChange={(e) => setUsername(e.target.value.replace('/', '').replace(' ', '-'))}
              />
              {/* <InputRightElement>
                <CheckCircleIcon color="green.500" boxSize="24px" />
              </InputRightElement> */}
            </InputGroup>
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
