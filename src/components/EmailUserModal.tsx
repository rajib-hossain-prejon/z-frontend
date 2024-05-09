import React from "react";
import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { emailToUploader } from "../api";

export default function EmailUserModal({ uploadId }: { uploadId: string }) {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [content, setContent] = React.useState('');

  const { isLoading, mutate } = useMutation((c: string) => emailToUploader(uploadId, c), {
    onSuccess: () => {
      setContent('');
      onClose();
    }
  });
  return (
    <React.Fragment>
      <Button variant="unstyled" size="sm" mt="6" onClick={() => onOpen()}>
        {t('common:email-user')}
      </Button>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" py="22px">
            <FormControl>
              <FormLabel>{t('common:your-message')}</FormLabel>
              <Textarea noOfLines={5} value={content} onChange={(e) => setContent(e.target.value)} />
            </FormControl>
            <Flex gap="4" justifyContent="flex-end" mt="4">
              <Button size="sm" variant="ghost" onClick={() => { onClose(); setContent('') }}>{t('common:cancel')}</Button>
              <Button size="sm" variant="solid" disabled={isLoading || !content} onClick={() => mutate(content)}>{t('common:confirm')}</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
