import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Else, If, Then, When } from 'react-if';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import UploadButton from '../../HomeHero/UploadButton';
import OutlineButton from '../OutlineButton';
import { changeAvatar } from '../../../api/user';
import useAuth from '../../../hooks/useAuth';
import Error from '../../Error';

export default function AvaterChange() {
  const { t } = useTranslation('auth');
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const { refetchUser } = useAuth();

  const [image, setImage] = React.useState<File | undefined>();
  const [imgUrl, setImgUrl] = React.useState('');

  const onClose = () => {
    setImage(undefined);
    setLoading(false);
    _onClose();
  };

  const [isLoading, setLoading] = React.useState(false);
  const { mutate, error } = useMutation(
    (img: File) => changeAvatar(img),
    {
      onMutate: () => setLoading(true),
      onSuccess: () => {
        refetchUser().then(() => onClose());
      },
      onError: () => setLoading(false)
    },
  );
  const err = (error as any)?.message || '';

  React.useEffect(() => {
    if (image) setImgUrl(URL.createObjectURL(image));
  }, [image]);
  return (
    <React.Fragment>
      <Button
        variant="unstyled"
        border="1.5px solid"
        borderColor="primary.400"
        px={2}
        fontWeight="normal"
        color="primary.400"
        onClick={() => onOpen()}
      >
        {t('change-gravatar')}
      </Button>
      <When condition={isOpen}>
        <Box
          className="flex flex-wrap"
          pos="absolute"
          insetX="0"
          top="0"
          h="max(100vh, 600px)"
          zIndex={100}
        >
          <Box
            w={{ base: 'full', md: '50%' }}
            pt={{ base: '5%', lg: '70px', xl: '100px' }}
            pb={{ base: '5%', lg: '60px' }}
            px="10"
            className="flex flex-col items-center"
            bgColor="gray.50"
            textAlign="center"
            h="full"
          >
            <Heading fontSize={{ base: '3xl', md: '3xl', lg: '4xl' }}>
              {t('upload-your-image')}
            </Heading>
            <Text color="gray.500" fontSize="xl" mt="3">
              {t('upload-your-gravatar')}
            </Text>
            <Box my="auto">
              <UploadButton inputProps={{ accept: 'image/png,image/jpg,image/jpeg' }} onChange={(f) => setImage(f[0])} />
            </Box>
            <Error message={err || ''} />
            <Flex gap={5} align="center" w="full" justify="flex-end">
              <OutlineButton size="sm" onClick={() => onClose()}>
                {t('common:cancel')}
              </OutlineButton>
              <Button
                variant="solid"
                size="sm"
                fontWeight="normal"
                colorScheme="primary"
                isLoading={isLoading}
                onClick={() => {
                  if (image) mutate(image);
                }}
              >
                {t('common:upload')}
              </Button>
            </Flex>
          </Box>
          <Box
            w={{ base: 'full', md: '50%' }}
            pt="85px"
            h="full"
            className="flex items-center justify-center"
            bgImage="linear-gradient(135deg, #9997bf 0.00%, #b0cde8 51.72%, #f21a5d 100.00%)"
          >
            <If condition={Boolean(image)}>
              <Then>
                <Img
                  alt="preview"
                  src={imgUrl}
                  aspectRatio={1}
                  w={{ base: '180px', sm: '200px', md: '250px', lg: '300px' }}
                  h={{ base: '180px', sm: '200px', md: '250px', lg: '300px' }}
                  rounded="full"
                />
              </Then>
              <Else>
                <Box
                  className="flex items-center justify-center"
                  bgColor="gray.50"
                  rounded="full"
                  w={{ base: '180px', sm: '200px', md: '250px', lg: '300px' }}
                  h={{ base: '180px', sm: '200px', md: '250px', lg: '300px' }}
                >
                  {t('preview')}
                </Box>
              </Else>
            </If>
          </Box>
        </Box>
      </When>
    </React.Fragment>
  );
}
