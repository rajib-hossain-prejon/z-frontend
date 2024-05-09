import {
  Button,
  Flex,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from '@reach/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { moveUpload } from '../../../api/user';
import Error from '../../Error';
import useAuth from '../../../hooks/useAuth';

// Move Upload to Another workspace Modal
export default function MoveFileModal(props: { id: string }) {
  const { t } = useTranslation('manage');
  const { user, refetchUser } = useAuth();
  const workspaceId = useParams()?.id;
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();

  const [targetId, setTargetId] = React.useState('');

  const onClose = () => {
    setTargetId('');
    setLoading(false);
    _onClose();
  };

  const client = useQueryClient();
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (targetId: string) =>
      moveUpload({
        targetWorkspaceId: targetId,
        currentWorkspaceId: workspaceId,
        uploadId: props.id,
      }),
    {
      onMutate: () => setLoading(true),
      // refetch workspace to update the data
      onSuccess: () => {
        client.refetchQueries(['workspace', workspaceId]);
        refetchUser().then(() => setLoading(false)).then(() => onClose());
      },
      onError: () => setLoading(false)
    },
  );
  const err = (error as any)?.message || '';
  return (
    <React.Fragment>
      <MenuItem onClick={() => onOpen()}>{t('move')}</MenuItem>
      <Modal isOpen={isOpen || isLoading} onClose={() => onClose()} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">
              {t('move-your-uploaded-file-to-another-workspace')}
            </Text>
            <Error message={err} />
            <Select
              size="lg"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            >
              <option value="" disabled>
                {t('select-workspace')}
              </option>
              {user?.workspaces
                .filter((w) => w._id !== workspaceId)
                .map((ws) => (
                  <option key={ws._id} value={ws._id}>
                    {ws.name}
                  </option>
                ))}
            </Select>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                isLoading={isLoading}
                onClick={() => mutate(targetId)}
              >
                {t('move')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>

  );
}
