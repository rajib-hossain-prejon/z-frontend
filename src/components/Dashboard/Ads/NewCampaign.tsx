import React from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Switch,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import moment from 'moment';
import { navigate } from 'gatsby';
import { When } from 'react-if';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import Topbar from '../Topbar';
import { createCampaign } from '../../../api/user';
import { getWindow } from '../../../utils/inBrowser';
import CampaignPricingOverView from './CampaignPricingOverview';

export interface ICreative {
  url: string;
  image: File;
  imgUrl: string;
}

const defaultCreative: ICreative = {
  url: '',
  image: { name: '', type: '', size: 0 } as File, // no name means file is not selected
  imgUrl: '',
};

export default function NewCampaign(props: RouteComponentProps) {
  const { t } = useTranslation('ads');
  const toast = useToast();
  const [isSaving, setSaving] = React.useState(false);
  const [isContinuing, setContinuing] = React.useState(false);

  const client = useQueryClient();
  const { mutate } = useMutation(createCampaign, {
    onSuccess: (d) => {
      client.refetchQueries(['campaigns']).then(() => {
        if (isSaving) {
          navigate('/ads');
        } else if (isContinuing) {
          navigate(`/ads/campaigns/${d._id}/pay`);
        }
      });
    },
    onError: (e: any) =>
      toast({
        title: e.message,
        duration: 5000,
        colorScheme: 'red',
        isClosable: true,
        position: 'top-right',
      }),
    onSettled: () => {
      setSaving(false);
      setContinuing(false);
    },
  });


  const campaignSchema = yup.object({
    title: yup
      .string()
      .min(3, t('validations:title-min-length'))
      .required(t('validations:title-is-required')),
    description: yup
      .string()
      .min(10, t('validations:description-min-length'))
      .required(t('validations:description-is-required')),
    display: yup
      .array()
      .of(yup.string().oneOf(['upload-screen', 'download-screen']))
      .min(1, t('validations:display-min-length'))
      .required(t('validations:display-is-required')),
    isABTesting: yup.bool().required(t('validations:isABTesting-is-required')),
    creative: yup
      .object({
        url: yup
          .string()
          .url(t('validations:invalid-creative-url'))
          .required(t('validations:creative-url-is-required')),
        image: yup
          .mixed()
          .test(
            'is-image',
            t('validations:invalid-image-file'),
            (val: any) => {
              return (
                ['image/png', 'image/jpg', 'image/jpeg'].includes(val.type) &&
                val.name
              );
            },
          )
          .required(t('validations:creative-image-is-required')),
      })
      .required(t('validations:creative-is-required')),
    creativeABTesting: yup.object().when('isABTesting', {
      is: true,
      then: () =>
        yup
          .object({
            url: yup
              .string()
              .url(t('validations:invalid-creative-url'))
              .required(t('validations:creative-url-is-required')),
            image: yup
              .mixed()
              .test(
                'is-image',
                t('validations:invalid-image-file'),
                (val: any) => {
                  return (
                    ['image/png', 'image/jpg', 'image/jpeg'].includes(val.type) &&
                    val.name
                  );
                },
              )
              .required(t('validations:creative-image-is-required')),
          })
          .required(t('validations:creative-is-required')), // This line is important
      otherwise: () => yup.object().nullable(), // Allow nullable when isABTesting is false
    }),
    startDate: yup
      .string()
      .test(
        'valid-start-date',
        t('validations:invalid-start-date'),
        (val) =>
          moment(val).isValid() &&
          !moment(val).isBefore(moment().format('YYYY-MM-DD')),
      )
      .required(t('validations:start-date-is-required')),
    endDate: yup
      .string()
      .test('valid-end-date', t('validations:invalid-end-date'), (val) => moment(val).isValid())
      .test(
        '3-days-after-&-upto-30-days',
        t('validations:end-date-range'),
        (val, ctx) => {
          const diffDays = moment(val).diff(moment(ctx.parent.startDate), 'days');
          return diffDays >= 3 && diffDays <= 30;
        },
      )
      .required(t('validations:end-date-is-required')),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      display: ['upload-screen'] as ('upload-screen' | 'download-screen')[],
      isABTesting: false,
      creative: defaultCreative,
      creativeABTesting: defaultCreative,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(3, 'days').format('YYYY-MM-DD'),
    },
    validationSchema: campaignSchema,
    onSubmit: (vals) => mutate(vals),
  });

  const handleSave = () => {
    // handle save logic
    if (!Object.keys(formik.errors).length) setSaving(true);
    formik.submitForm();
  };

  const handleSubmit = () => {
    if (!Object.keys(formik.errors).length) setContinuing(true);
    formik.submitForm();
  };

  React.useEffect(() => {
    if (
      !formik.values.isABTesting &&
      (formik.values.creativeABTesting?.image?.name ||
        formik.values.creativeABTesting?.url)
    ) {
      // if ab testing is unchecked, reset creativeABTesting
      formik.setFieldValue('creativeABTesting', defaultCreative);
    }
  }, [formik.values.isABTesting]);
  React.useEffect(() => {
    const img: any = formik.values.creative.image;
    if (!getWindow() || !img || !(img instanceof File)) return;
    formik.setFieldValue(
      'creative.imgUrl',
      img.name ? URL.createObjectURL(img) : '',
    );
  }, [formik.values.creative.image]);
  React.useEffect(() => {
    const img: any = formik.values.creativeABTesting?.image;
    if (!getWindow() || !img || !(img instanceof File)) return;
    formik.setFieldValue('creativeABTesting.imgUrl', URL.createObjectURL(img));
  }, [formik.values.creativeABTesting?.image]);
  return (
    <Box
      as="form"
      className="flex flex-col route"
      h="full"
      w="full"
      onSubmit={formik.handleSubmit}
    >
      <Topbar
        title={t("new-campaign")}
        description={t("create-your-campaign-with-your-creatives")}
        actions={
          <Button
            size="sm"
            variant="outline"
            colorScheme="primary"
            order="9"
            ml="auto"
            isLoading={isSaving}
            onClick={handleSave}
          >
            {t("common:save-and-exit")}
          </Button>
        }
      />
      <Box
        className="flex flex-wrap justify-between items-start no-scrollbar"
        pt="14"
        gap={4}
        maxH="full"
        overflowY="auto"
      >
        <Box
          className="flex flex-col"
          pb={8}
          gap={8}
          order={{ base: 2, lg: 1 }}
          w={{ base: 'full', lg: 'calc(100% - 400px)' }}
        >
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <Text>{t("description")}</Text>
            <Text color="gray.500">
              {t("name-your-campaign-and-write-a-small-description")}
            </Text>
            <FormControl
              isInvalid={Boolean(formik.touched.title && formik.errors.title)}
            >
              <Input
                type="text"
                placeholder={t("title")}
                mt={2}
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={Boolean(
                formik.touched.description && formik.errors.description,
              )}
            >
              <Textarea
                rows={5}
                placeholder={t("description")}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <Text>{t("display")}</Text>
            <Text color="gray.500">{t("choose-the-placement-for-your-ads")}</Text>
            <FormControl
              isInvalid={Boolean(
                formik.touched.display && formik.errors.display,
              )}
            >
              <CheckboxGroup
                value={formik.values.display}
                onChange={(value: string[]) =>
                  formik.setFieldValue('display', value)
                }
              >
                <Flex
                  align="center"
                  gap={4}
                  fontWeight="normal"
                  flexWrap="wrap"
                  sx={{
                    '& .chakra-checkbox__control': {
                      display: 'none !important',
                    },
                  }}
                >
                  <Button
                    as={Checkbox}
                    variant={
                      formik.values.display.includes('upload-screen')
                        ? 'solid'
                        : 'outline'
                    }
                    colorScheme="primary"
                    fontWeight="normal"
                    value="upload-screen"
                  >
                    {t("upload-screen")}
                  </Button>
                  <Button
                    as={Checkbox}
                    variant={
                      formik.values.display.includes('download-screen')
                        ? 'solid'
                        : 'outline'
                    }
                    colorScheme="primary"
                    fontWeight="normal"
                    value="download-screen"
                  >
                    {t("download-screen")}
                  </Button>
                </Flex>
              </CheckboxGroup>
              <FormErrorMessage>{formik.errors.display}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <Text>{t("creatives-upload-screen")}</Text>
            <Text color="gray.500">
              {t("upload-your-creative-recommended-size-1112-x-1080-px")}
            </Text>
            <Divider borderColor="gray.600" />
            <Flex justify="space-between" align="center">
              <Box className="flex flex-col" gap={3}>
                <Text>{t("a-b-testing")}</Text>
                <Text color="gray.500">
                  {t("test-two-creatives-so-you-know-which-performs-better")}
                </Text>
              </Box>
              <Switch
                size="lg"
                colorScheme="primary"
                isChecked={formik.values.isABTesting}
                name="isABTesting"
                onChange={formik.handleChange}
              />
            </Flex>
            <Divider borderColor="gray.600" />
            <Text>{t("set-target-and-upload-creative")}</Text>
            <Text color="gray.500">
              {t("paste-your-target-url-and-upload-creative")}
            </Text>
            <FormControl
              isInvalid={Boolean(
                formik.errors.creative?.url && formik.touched.creative?.url,
              )}
            >
              <Input
                type="text"
                variant="outline"
                placeholder="URL"
                borderColor="gray.600"
                name="creative.url"
                value={formik.values.creative.url}
                onChange={formik.handleChange}
              />
              <FormErrorMessage>{formik.errors.creative?.url}</FormErrorMessage>
            </FormControl>
            <Text color="gray.500" mt={3}>
              {formik.values.creative?.image?.name}
            </Text>
            <FormControl
              isInvalid={Boolean(
                formik.touched.creative?.image && formik.errors.creative?.image,
              )}
            >
              <Button
                as="label"
                htmlFor="creative-image"
                variant="solid"
                colorScheme="primary"
                fontWeight="normal"
                alignSelf="start"
                minW="130px"
              >
                {t("upload")}
              </Button>
              <Input
                type="file"
                id="creative-image"
                display="none"
                name="creative.image"
                onChange={(e) => {
                  if (Boolean(e.target.files)) {
                    formik.setFieldValue('creative.image', e.target.files![0]);
                  }
                }}
              />
              <FormErrorMessage>
                {formik.errors.creative?.image?.toString()}
              </FormErrorMessage>
            </FormControl>
            <When condition={formik.values.isABTesting}>
              <Divider borderColor="gray.600" />
              <Text>{t("a-b-testing-creative")}</Text>
              <Text color="gray.500">
                {t("paste-your-target-url-and-upload-creative")}
              </Text>
              <FormControl
                isInvalid={Boolean(
                  formik.touched.creativeABTesting?.url &&
                  formik.errors.creativeABTesting?.url,
                )}
              >
                <Input
                  type="text"
                  variant="outline"
                  placeholder="URL"
                  borderColor="gray.600"
                  name="creativeABTesting.url"
                  value={formik.values.creativeABTesting?.url || ''}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>
                  {formik.errors.creativeABTesting?.url}
                </FormErrorMessage>
              </FormControl>
              <Text color="gray.500" mt={3}>
                {formik.values.creativeABTesting?.image?.name}
              </Text>
              <FormControl
                isInvalid={Boolean(
                  formik.touched.creativeABTesting?.image &&
                  formik.errors.creativeABTesting?.image,
                )}
              >
                <Button
                  as="label"
                  htmlFor="creative-abtesting-image"
                  variant="solid"
                  colorScheme="primary"
                  fontWeight="normal"
                  alignSelf="start"
                  minW="130px"
                >
                  {t("upload")}
                </Button>
                <Input
                  type="file"
                  id="creative-abtesting-image"
                  display="none"
                  name="creativeABTesting.image"
                  onChange={(e) => {
                    if (Boolean(e.target.files)) {
                      formik.setFieldValue(
                        'creativeABTesting.image',
                        e.target.files![0],
                      );
                    }
                  }}
                />
                <FormErrorMessage>
                  {formik.errors.creativeABTesting?.image?.toString()}
                </FormErrorMessage>
              </FormControl>
            </When>
          </Box>
          <Box
            rounded="xl"
            bgColor="gray.50"
            p="5%"
            className="flex flex-col"
            gap={3}
          >
            <Text>{t("timing")}</Text>
            <Text color="gray.500">
              {t(
                "set-your-date-for-advertisement-minimum-advertisement-period-is-3-days",
              )}
            </Text>
            <Flex gap={6} fontWeight="normal" flexWrap="wrap">
              <FormControl
                maxW="44%"
                isInvalid={Boolean(
                  formik.touched.startDate && formik.errors.startDate,
                )}
              >
                <FormLabel>{t("start-date")}:</FormLabel>
                <Input
                  type="date"
                  variant="outline"
                  borderColor="primary.500 !important"
                  placeholder="Start date"
                  value={moment(formik.values.startDate).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    formik.setFieldValue(
                      'startDate',
                      moment(e.target.value).format('YYYY-MM-DD'),
                    );
                    if (
                      moment(formik.values.endDate).diff(
                        moment(e.target.value),
                        'days',
                      ) < 3
                    ) {
                      formik.setFieldValue(
                        'startDate',
                        moment(e.target.value)
                          .add(3, 'days')
                          .format('YYYY-MM-DD'),
                      );
                    }
                  }}
                />
                <FormErrorMessage>{formik.errors.startDate}</FormErrorMessage>
              </FormControl>
              <FormControl
                maxW="44%"
                isInvalid={Boolean(
                  formik.touched.endDate && formik.errors.endDate,
                )}
              >
                <FormLabel>{t("end-date")}:</FormLabel>
                <Input
                  type="date"
                  variant="outline"
                  borderColor="primary.500 !important"
                  placeholder="End date"
                  value={moment(formik.values.endDate).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    if (
                      moment(e.target.value).diff(
                        moment(formik.values.startDate),
                        'days',
                      ) < 3
                    )
                      return;
                    formik.setFieldValue(
                      'endDate',
                      moment(e.target.value).format('YYYY-MM-DD'),
                    );
                  }}
                />
                <FormErrorMessage>{formik.errors.endDate}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
        </Box>
        <CampaignPricingOverView
          isLoading={isContinuing}
          title={formik.values.title}
          isABTesting={formik.values.isABTesting}
          creatives={
            [formik.values.creative, formik.values.creativeABTesting].filter(
              (c) => c?.url && c?.image?.name,
            ) as ICreative[]
          }
          display={
            formik.values.display as ('upload-screen' | 'download-screen')[]
          }
          endDate={formik.values.endDate}
          startDate={formik.values.startDate}
          isBilling={false}
          onContinue={() => handleSubmit()}
        />
      </Box>
    </Box>
  );
}
