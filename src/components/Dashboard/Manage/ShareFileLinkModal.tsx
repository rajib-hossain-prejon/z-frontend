import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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

import { CopyIcon } from '@chakra-ui/icons';
import { copyTextToClipboard, isBrowser } from '../../../utils';
// Upload Link Modal
export default function ShareFileLinkModal(props: { id: string }) {
  const { t } = useTranslation('manage');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setCopied] = React.useState(false);
  const link = isBrowser()
    ? `${window.location.origin}/download?uploadId=${props.id}`
    : '';
  const handleClose = () => {
    setCopied(false);
    onClose();
  };
  return (
    <React.Fragment>
      <MenuItem onClick={() => onOpen()}>{t('copy-link')}</MenuItem>
      <Modal isOpen={isOpen} onClose={() => handleClose()} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('share-this-link')}</Text>
            <InputGroup size="lg">
              <Input
                type="text"
                placeholder={t('name-of-the-file')}
                bgColor={isCopied ? 'primary.100' : 'unset'}
                defaultValue={
                  isCopied ? t('link-is-copied-ready-to-share') : link
                }
                color={isCopied ? 'primary.500' : 'initial'}
                readOnly
              />
              <InputRightElement>
                <IconButton
                  aria-label={t('copy-link')}
                  color="primary.500"
                  icon={<Icon as={CopyIcon} boxSize="24px" />}
                  onClick={() =>
                    copyTextToClipboard(link).then(() => setCopied(true))
                  }
                />
              </InputRightElement>
            </InputGroup>
            <Flex align="center" justify="flex-end" gap={5} mt="6">
              <Button variant="solid" size="sm" onClick={() => handleClose()}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                onClick={() =>
                  copyTextToClipboard(link).then(() => setCopied(true))
                }
              >
                {t('copy-link')}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>

  );
}
