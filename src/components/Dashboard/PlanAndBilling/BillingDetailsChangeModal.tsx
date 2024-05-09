import React, { FormEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import useAuth from '../../../hooks/useAuth';
import { updateBillingDetails } from '../../../api/user';
import Error from '../../Error';

// Define initial form values
const initialValues = {
  name: '',
  address: '',
  postalCode: '',
  city: '',
  country: '',
  vatNumber: '',
};

export default function BillingDetailsChangeModal() {
  const { t } = useTranslation('pricing');
  const { user, refetchUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (vals: {
      name: string;
      address: string;
      postalCode: string;
      city: string;
      country: string;
      vatNumber: string;
    }) => updateBillingDetails(vals),
    {
      onMutate: () => setLoading(true),
      onSuccess: () => {
        // refetch user details
        refetchUser().then(() => setLoading(false)).then(() => onClose());
      },
      onError: () => setLoading(true),
    },
  );
  const err = (error as any)?.message || '';

  // Define the billing details validation schema
  const billingDetailsSchema = yup.object({
    name: yup.string().trim().required(t('validations:full-name-is-required')),
    address: yup.string().trim().required(t('validations:address-is-required')),
    postalCode: yup
      .string()
      .trim()
      .matches(/^[\w\d\s-]+$/, t('validations:invalid-postal-code'))
      .required(t('validations:postal-code-is-required')),
    city: yup.string().trim().required(t('validations:city-is-required')),
    country: yup.string().trim().required(t('validations:country-is-required')),
    vatNumber: yup
      .string()
      .trim()
      .matches(/^[\w\d\s-]+$/, t('validations:invalid-vat-number')),
  });
  // Configure useFormik hook with validation schema
  const formik = useFormik({
    initialValues: user?.billing || initialValues,
    validationSchema: billingDetailsSchema,
    onSubmit: (values) => {
      // Handle form submission here
      mutate(values);
    },
  });

  return (
    <React.Fragment>
      <Button
        variant="outline"
        colorScheme="primary"
        px={2}
        mt={2}
        w="fit-content"
        fontWeight="normal"
        onClick={onOpen}
      >
        {t('edit-billing-details')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent
          w="95%"
          minH="fit-content"
          as="form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => formik.handleSubmit(e)}
        >
          <ModalCloseButton size="lg" onClick={onClose} />
          <ModalBody className="flex flex-col" py="64px">
            <Text fontSize="3xl">Billing Details</Text>
            <Error message={err} />
            <Box className="flex flex-col" mt={5} gap={5}>
              <FormControl
                isInvalid={Boolean(formik.touched.name && formik.errors.name)}
              >
                <FormLabel color="gray.500" mb={0}>
                  {t('common:name')}&nbsp;{t('common:or')}&nbsp;
                  {t('common:company')}*
                </FormLabel>
                <Input
                  type="text"
                  placeholder={`${t('common:name')} ${t('common:or')} ${t(
                    'common:company',
                  )}`}
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <Text color="red.500">{formik.errors.name}</Text>
                )}
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  formik.touched.address && formik.errors.address,
                )}
              >
                <FormLabel color="gray.500" mb={0}>
                  {t('address')}*
                </FormLabel>
                <Input
                  type="text"
                  placeholder={t('name-of-the-street-and-number')}
                  name="address"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address && (
                  <Text color="red.500">{formik.errors.address}</Text>
                )}
              </FormControl>
              <Box className="flex flex-wrap items-center justify-between">
                <FormControl
                  w={{ base: 'full', lg: '30%' }}
                  isInvalid={Boolean(
                    formik.touched.postalCode && formik.errors.postalCode,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('postal-code')}*
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="67050"
                    name="postalCode"
                    onChange={formik.handleChange}
                    value={formik.values.postalCode}
                  />
                  {formik.touched.postalCode && formik.errors.postalCode && (
                    <Text color="red.500">{formik.errors.postalCode}</Text>
                  )}
                </FormControl>
                <FormControl
                  w={{ base: 'full', lg: '30%' }}
                  isInvalid={Boolean(formik.touched.city && formik.errors.city)}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('city')}*
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Berlin"
                    name="city"
                    onChange={formik.handleChange}
                    value={formik.values.city}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <Text color="red.500">{formik.errors.city}</Text>
                  )}
                </FormControl>
                <FormControl
                  w={{ base: 'full', lg: '30%' }}
                  isInvalid={Boolean(
                    formik.touched.country && formik.errors.country,
                  )}
                >
                  <FormLabel color="gray.500" mb={0}>
                    {t('country')}*
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Germany"
                    name="country"
                    onChange={formik.handleChange}
                    value={formik.values.country}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <Text color="red.500">{formik.errors.country}</Text>
                  )}
                </FormControl>
              </Box>
              <FormControl
                isInvalid={Boolean(
                  formik.touched.vatNumber && formik.errors.vatNumber,
                )}
              >
                <FormLabel color="gray.500" mb={0}>
                  {t('vat-number')}
                </FormLabel>
                <Input
                  type="text"
                  placeholder="DE-12345678"
                  name="vatNumber"
                  onChange={formik.handleChange}
                  value={formik.values.vatNumber}
                />
                {formik.touched.vatNumber && formik.errors.vatNumber && (
                  <Text color="red.500">{formik.errors.vatNumber}</Text>
                )}
              </FormControl>
            </Box>
            <Flex align="center" justify="flex-end" gap={5} mt="10">
              <Button variant="solid" size="sm" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button
                type="submit"
                variant="solid"
                size="sm"
                colorScheme="primary"
                isLoading={isLoading}
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
