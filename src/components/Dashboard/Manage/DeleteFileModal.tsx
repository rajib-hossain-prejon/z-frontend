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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useParams } from '@reach/router';
import { useTranslation } from 'react-i18next';

import { deleteUpload } from '../../../api/user';
import useAuth from '../../../hooks/useAuth';
import Error from '../../Error';

export default function DeleteFileModal(props: { id: string; name: string }) {
  const { t } = useTranslation('manage');
  const { refetchUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const workspaceId = useParams()?.id;
  const client = useQueryClient();
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    () => deleteUpload(workspaceId, props.id),
    {
      onMutate: () => setLoading(true),
      // refetch workspace to update the data
      onSuccess: () => {
        client.refetchQueries(['workspace', workspaceId]);
        // refetch user data for updating storage and workspaces
        refetchUser().then(() => onClose());
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
            <Text fontSize="3xl">{t('common:delete')} {props.name}?</Text>
            <Error message={err} />
            <Text fontSize="xl" color="gray.500">
              {t('if-you-delete')} {props.name}
              <br />
              {t('you-will-loose-all-of-your-data')}
            </Text>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button variant="solid" size="sm" colorScheme="red" isLoading={isLoading} onClick={() => mutate()}>
                {t('common:delete')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>

  );
}
