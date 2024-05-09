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
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import OutlineButton from '../OutlineButton';
import Error from '../../Error';
import { changePassword } from '../../../api/user';
import useAuth from '../../../hooks/useAuth';
import { When } from 'react-if';

export default function PasswordChangeModal() {
  const { t } = useTranslation('auth');
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const { refetchUser } = useAuth();

  let reset: () => any;
  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (data: { oldPassword: string; newPassword: string }) =>
      changePassword(data),
    {
      onMutate: () => setLoading(true),
      onSuccess: () => {
        refetchUser().then(() => {
          onClose();
          reset();
        }).then(() => setLoading(false));
      },
      onError: () => setLoading(false),
    },
  );
  const err = (error as any)?.message || '';

  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required(t('validations:old-password-is-required')),
    newPassword: yup
      .string()
      .required(t('validations:new-password-is-required'))
      .min(8, 'validations:new-password-min-length'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('validations:passwords-must-match'))
      .required(t('validations:confirm-password-is-required')),
  });
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema, // Use the Yup validation schema
    onSubmit: (values) => {
      mutate({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
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
        {t('change-password')}
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
              <Text fontSize="3xl">{t('change-your-password')}</Text>
              <Text color="gray.500">
                {/* You&apos;ll be logged out after making the change.
              <br /> */}
                {t('use-your-new-password-to-log-back-in')}
              </Text>
              <Error message={err || ''} mt={2} />
              <Box className="flex flex-col" mt={5} gap={5}>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.oldPassword && formik.touched.oldPassword,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('your-old-password')}
                  </FormLabel>
                  <Input
                    type="password"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    value={formik.values.oldPassword}
                  />
                  <When
                    condition={Boolean(
                      formik.errors.oldPassword && formik.touched.oldPassword,
                    )}
                  >
                    <FormHelperText color="red.500">
                      {formik.errors.oldPassword}
                    </FormHelperText>
                  </When>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.newPassword && formik.touched.newPassword,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('your-new-password')}
                  </FormLabel>
                  <Input
                    type="password"
                    name="newPassword"
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                  />
                  <When
                    condition={Boolean(
                      formik.errors.newPassword && formik.touched.newPassword,
                    )}
                  >
                    <FormHelperText color="red.500">
                      {formik.errors.newPassword}
                    </FormHelperText>
                  </When>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.confirmPassword &&
                    formik.touched.confirmPassword,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('confirm-new-password')}
                  </FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                  <When
                    condition={Boolean(
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword,
                    )}
                  >
                    <FormHelperText color="red.500">
                      {formik.errors.confirmPassword}
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
