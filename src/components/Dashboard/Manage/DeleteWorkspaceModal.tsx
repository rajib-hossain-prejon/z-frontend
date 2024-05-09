import {
  Button,
  Flex,
  MenuItem,
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
import { navigate } from 'gatsby';

import useAuth from '../../../hooks/useAuth';
import { deleteWorkspace } from '../../../api/user';
import Error from '../../Error';

export default function DeleteWorkspaceModal(props: { workspaceId: string; }) {
  const { t } = useTranslation('manage');
  const { refetchUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    () => deleteWorkspace(props.workspaceId),
    {
      onMutate: () => setLoading(true),
      // refetch workspace to update the data
      onSuccess: () => {
        // refetch user data for updating storage and workspaces
        refetchUser().then(() => setLoading(false)).then(
          () => navigate('/manage', { replace: true })
        ).then(() => onClose());
      },
      onError: () => setLoading(false)
    },
  );
  const err = (error as any)?.message || '';
  return (
    <React.Fragment>
      <MenuItem onClick={() => onOpen()}>{t('common:delete')}</MenuItem>
      <Modal isOpen={isOpen || isLoading} onClose={() => onClose()} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('delete-workspace')}</Text>
            <Error message={err} />
            <Text fontSize="xl" color="gray.500">
              {t('if-you-delete-workspace')}&nbsp;
              {t('you-will-loose-all-of-your-data')}
            </Text>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button variant="solid" size="sm" colorScheme="red" isLoading={isLoading} onClick={() => mutate()}>
                {t('delete-workspace')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
