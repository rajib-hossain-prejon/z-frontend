import {
  Button,
  Flex,
  Input,
  InputGroup,
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
import { useParams } from '@reach/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { updateUploadName } from '../../../api/user';
import Error from '../../Error';
// Rename Upload Modal
export default function RenameFileModal(props: { id: string }) {
  const { t } = useTranslation('manage');
  const workspaceId = useParams()?.id;
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();

  const [name, setName] = React.useState('');

  const onClose = () => {
    setName('');
    setLoading(false);
    _onClose();
  };

  const client = useQueryClient();
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (newName: string) => updateUploadName(workspaceId, props.id, newName),
    {
      // refetch workspace to update the data
      onSuccess: () => {
        client.refetchQueries(['workspace', workspaceId]).then(() => setLoading(false)).then(() => onClose());
      },
      onError: () => setLoading(false)
    },
  );
  const err = (error as any)?.message || '';
  return (
    <React.Fragment>
      <MenuItem onClick={() => onOpen()}>{t('rename-your-uploaded-file')}</MenuItem>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('rename-your-uploaded-file')}</Text>
            <Error message={err} />
            <InputGroup size="lg">
              <Input
                type="text"
                placeholder={t('name-of-the-file')}
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
                {t('rename')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>

  );
}
