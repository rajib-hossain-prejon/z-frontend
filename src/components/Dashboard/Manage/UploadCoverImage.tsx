import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { When } from 'react-if';
import { SketchPicker } from 'react-color';

import UploadButton from '../../HomeHero/UploadButton';
import OutlineButton from '../OutlineButton';
import Error from '../../Error';
import { useTranslation } from 'react-i18next';
import TornadoFeatureAlert from '../../TornadoFeatureAlert';
import useAuth from '../../../hooks/useAuth';

const colors = [
  '#B47979',
  '#B4A279',
  '#84B479',
  '#79AFB4',
  '#7E79B4',
  '#B479AD',
];

interface IUploadCoverImage {
  areColorsVisible?: boolean;
  isLoading?: boolean;
  error?: string;
  onSave: (args: { img?: File; color?: string; close: Function }) => any;
}

export default function UploadCoverImage(props: IUploadCoverImage) {
  const { t } = useTranslation('uploader');
  const { user } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [image, setImage] = React.useState<File | undefined>();
  const [imgUrl, setImgUrl] = React.useState('');
  const [color, setColor] = React.useState<string>('');
  
  const tornadoFeatureAlert = useDisclosure();

  const handleClose = () => {
    setImage(undefined);
    setColor('');
    onClose();
  };

  const handleSave = () => {
    props.onSave({ img: image, color, close: handleClose });
  };

  React.useEffect(() => {
    if (image) setImgUrl(URL.createObjectURL(image));
  }, [image]);
  return (
    <React.Fragment>
      <MenuItem onClick={() => onOpen()}>
        {t('manage:upload-cover-image')}
      </MenuItem>
      <When condition={isOpen}>
        <Portal>
          <Box
            className="flex flex-wrap"
            pos="absolute"
            insetX="0"
            top="0"
            h="max(100vh, 900px)"
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
              <Box
                className="flex flex-col"
                maxW="500px"
                w="full"
                flexGrow={1}
                mx="auto"
                px={5}
              >
                <Heading fontSize={{ base: '3xl', md: '3xl', lg: '4xl' }}>
                  {t('auth:upload-your-image')}
                </Heading>
                <Text color="gray.500" alignSelf="center" maxW="292px" mt="3">
                  {t('drag-your-cover-image')} <br />
                  {t('upload-it-for-name-of-the-file')}
                </Text>
                <Box m="auto">
                  <UploadButton
                    inputProps={{ accept: 'image/png,image/jpg,image/jpeg'}}
                    onChange={(f) => {
                      if (!user?.subscription?.type) {
                        tornadoFeatureAlert.onOpen();
                      } else setImage(f[0]);
                    }}
                  />
                  <TornadoFeatureAlert
                    isOpen={tornadoFeatureAlert.isOpen}
                    onClose={tornadoFeatureAlert.onClose}
                  />
                </Box>
                <When condition={props.areColorsVisible}>
                  <Box
                    className="flex flex-wrap justify-center items-center"
                    gap={4}
                    m="auto"
                  >
                    {colors.map((cl) => (
                      <Box
                        key={cl}
                        as="button"
                        boxSize="41px"
                        bgColor={cl}
                        rounded="full"
                        outline={color === cl ? '4px solid' : '0px solid'}
                        outlineColor="primary.500"
                        outlineOffset={4}
                        onClick={() => setColor(cl)}
                      />
                    ))}
                    <Menu isLazy closeOnBlur closeOnSelect={false}>
                      <MenuButton>
                        <Box
                          boxSize="41px"
                          bgImage="conic-gradient(from 90deg at 50% 50%, #FF0000 0.00%, #EBFF00 12.32%, #CEFF00 24.14%, #0ADF0A 37.93%, #00FFEB 50.25%, #1B35C5 64.53%, #8002FF 76.85%, #FF0000 88.18%, #FF0000 100.00%)"
                          rounded="full"
                        />
                      </MenuButton>
                      <MenuList p={0}>
                        <MenuItem p={0} as="div">
                          <SketchPicker
                            color={color}
                            onChange={(cl) => setColor(cl.hex)}
                          />
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </When>
                <Error message={props.error} />
              </Box>
              <Flex
                gap={5}
                align="center"
                w="full"
                justify="flex-end"
                mt="60px"
              >
                <OutlineButton
                  size="sm"
                  onClick={() => handleClose()}
                  disabled={props.isLoading}
                >
                  {t('common:cancel')}
                </OutlineButton>
                <Button
                  variant="solid"
                  size="sm"
                  fontWeight="normal"
                  colorScheme="primary"
                  isLoading={props.isLoading}
                  onClick={() => handleSave()}
                >
                  {t('common:save-and-exit')}
                </Button>
              </Flex>
            </Box>
            <Box
              w={{ base: 'full', md: '50%' }}
              h="full"
              className="flex items-center justify-center"
              bgImage={
                imgUrl
                  ? `url(${imgUrl})`
                  : 'linear-gradient(135deg, #9997bf 0.00%, #b0cde8 51.72%, #f21a5d 100.00%)'
              }
              bgPos="50% 50%"
              bgRepeat="no-repeat"
              bgSize="cover"
            >
              <When condition={!image}>
                <Box
                  className="flex items-center justify-center"
                  bgColor="rgba(255, 255, 255, 0.6)"
                  rounded="lg"
                  w={{ base: '180px', lg: '230px' }}
                  aspectRatio={282 / 237}
                >
                  {t('image-preview')}
                </Box>
              </When>
            </Box>
          </Box>
        </Portal>
      </When>
    </React.Fragment>
  );
}
