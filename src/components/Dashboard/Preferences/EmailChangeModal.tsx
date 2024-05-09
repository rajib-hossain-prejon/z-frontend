import React, { FormEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { When } from 'react-if';

import OutlineButton from '../OutlineButton';
import { changeEmail } from '../../../api/user';
import Error from '../../Error';
import { useTranslation } from 'react-i18next';

export default function EmailChangeModal() {
  const { t } = useTranslation('auth');
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();

  let reset: () => any;
  const { isLoading, mutate, error } = useMutation(
    (data: { email: string; password: string }) => changeEmail(data),
    {
      onSuccess: () => {
        onClose();
        reset();
      },
    },
  );
  const err = (error as any)?.message || '';

  const validationSchema = yup.object().shape({
    email: yup.string().email(t('validations:invalid-email')).required(t('validations:email-is-required')),
    password: yup.string().required(t('validations:password-is-required')),
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema, // Use the Yup validation schema
    onSubmit: (values) => {
      mutate({
        email: values.email,
        password: values.password,
      });
    },
  });
  reset = formik.resetForm;

  const onClose = () => {
    formik.resetForm();
    _onClose();
  };
  return (
    <React.Fragment>
      <OutlineButton
        variant="unstyled"
        px={2}
        fontWeight="normal"
        onClick={() => onOpen()}
      >
        {t('change-email')}
      </OutlineButton>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size="lg" onClick={() => onClose()} />
          <ModalBody className="flex flex-col" py="64px">
            <form
              className="flex flex-col"
              onSubmit={(e: FormEvent<HTMLFormElement>) =>
                formik.handleSubmit(e as FormEvent<HTMLFormElement>)
              }
            >
              <Text fontSize="3xl">{t('change-your-email')}</Text>
              <Text color="gray.500">
                {t('change-email-info-line')}
              </Text>
              <Error message={err} mt={2} />
              <Box className="flex flex-col" mt={5} gap={5}>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.email && formik.touched.email,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('your-new-email')}
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <When
                    condition={Boolean(
                      formik.errors.email && formik.touched.email,
                    )}
                  >
                    <FormHelperText color="red.500">
                      {formik.errors.email}
                    </FormHelperText>
                  </When>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.password && formik.touched.password,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('your-password')}
                  </FormLabel>
                  <Input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <When
                    condition={Boolean(
                      formik.errors.password && formik.touched.password,
                    )}
                  >
                    <FormHelperText color="red.500">
                      {formik.errors.password}
                    </FormHelperText>
                  </When>
                </FormControl>
              </Box>
              <Flex align="center" justify="flex-end" gap={5} mt="10">
                <Button variant="solid" size="sm" onClick={() => onClose()}>
                  {t('common:cancel')}
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  size="sm"
                  colorScheme="primary"
                  isLoading={isLoading}
                >
                  {t('common:confirm')}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
