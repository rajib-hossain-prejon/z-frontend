import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import { copyTextToClipboard, isBrowser } from '../../../utils';
import SvgShare from '../../icons/SvgShare';

export default function ShareWorkspaceLinkModal(props: { id: string }) {
  const { t } = useTranslation('manage');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setCopied] = React.useState(false);
  const link = isBrowser()
    ? `${window.location.origin}/workspace?workspaceId=${props.id}`
    : '';
  const handleClose = () => {
    setCopied(false);
    onClose();
  };
  return (
    <React.Fragment>
      <Button
        variant="link"
        fontWeight="normal"
        leftIcon={<Icon as={SvgShare} boxSize="21px" />}
        mr={5}
        onClick={() => onOpen()}
      >
        {t('common:share')}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        isCentered
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" gap="5" py="64px">
            <Text fontSize="3xl">{t('share-this-link-to-this-workspace')}</Text>
            <InputGroup size="lg">
              <Input
                type="text"
                placeholder="Name of the file"
                bgColor={isCopied ? 'primary.100' : 'unset'}
                value={link}
                color={isCopied ? 'primary.500' : 'initial'}
                defaultValue={link}
                onChange={() => null}
              />
              <InputRightElement>
                <IconButton
                  aria-label="copy link"
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
