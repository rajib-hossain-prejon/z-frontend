import { Box, Icon, Input, InputProps, Text } from '@chakra-ui/react';
import React from 'react';
import { Case, Default, Else, If, Switch, Then } from 'react-if';
import SvgUpload from '../icons/SvgUpload';
import { useTranslation } from 'react-i18next';

interface IUploadButtonProps {
  inputProps?: InputProps,
  variant?: 'circular' | 'rectangular';
  onChange?: (files: File[]) => void;
}

const UploadButton = ({
  inputProps,
  variant,
  onChange,
}: React.PropsWithoutRef<IUploadButtonProps>) => {
  const { t } = useTranslation('uploader');
  const [isDragging, setDragging] = React.useState(false);
  const { current: uid } = React.useRef(`${Math.random() * 100}-${Date.now()}`); // generating unique id
  const setFiles = (f: FileList) => {
    if (typeof onChange === 'function') onChange(Array.from(f));
  };

  const drageOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const drageLeaveHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    const fl = (e.dataTransfer.files && e.dataTransfer.files) || null;
    if (!fl) return;
    setFiles(fl);
    setDragging(false);
  };
  return (
    <React.Fragment>
      <If condition={variant === 'rectangular'}>
        <Then>
          <Box
            as="label"
            htmlFor={`files-input-${uid}`}
            className="flex flex-col justify-center items-center"
            cursor="pointer"
            role="button"
            py={{ base: '1vh' }}
            px={{ base: '4vh' }}
            border="1px solid"
            borderColor="primary.500"
            rounded="lg"
            bgColor="primary.100"
            w="full"
            maxW="445px"
            onDragOver={drageOverHandler}
            onDragLeave={drageLeaveHandler}
            onDrop={dropHandler}
          >
            <Box
              as={SvgUpload}
              boxSize="10vh"
              sx={{ '& path': { fill: 'primary.500' } }}
            />
            <Switch>
              <Case condition={isDragging}>
                <Box
                  w="full"
                  maxW="162px"
                  color="gray.700"
                  textAlign="center"
                  fontWeight="normal"
                >
                  {t('file-incoming')}
                </Box>
              </Case>
              <Default>
                <Text color="gray.700" textAlign="center">
                  {t('drag-your-files-here-or-click-here-to-upload')}
                </Text>
              </Default>
            </Switch>
          </Box>
        </Then>
        <Else>
          <Box
            aspectRatio={1}
            maxH={{ base: '70vw', md: '26vh',  lg: '53vh' }}
            h={{ base: '39vh', md: '36vh', lg: '33vh' }}
            rounded="full"
            background="linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.7) 0%) 0% 0% no-repeat padding-box"
            backgroundColor="primary.400 !important"
            p="2vh"
            className="group"
            display="flex"
            _hover={{
              background:
                'linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.6) 0%) 0% 0% no-repeat padding-box',
            }}
            transitionProperty="background"
            transitionDuration="500ms"
            transitionDelay="100ms"
            pos="relative"
          >
            <Box
              as="label"
              htmlFor={`files-input-${uid}`}
              pos="absolute"
              bgColor="transparent"
              inset={0}
              rounded="full"
              onDragOver={drageOverHandler}
              onDragLeave={drageLeaveHandler}
              onDrop={dropHandler}
              cursor="pointer"
              zIndex={10}
            />
            <Box
              aspectRatio={1}
              h="full"
              rounded="full"
              background="linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.5) 0%) 0% 0% no-repeat padding-box"
              backgroundColor="primary.400 !important"
              p="2vh"
              className="flex"
              m="auto"
              transitionProperty="background"
              transitionDuration="500ms"
              _groupHover={{
                background:
                  'linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.4) 0%) 0% 0% no-repeat padding-box',
              }}
              _hover={{
                background:
                  'linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.4) 0%) 0% 0% no-repeat padding-box',
              }}
            >
              <Box
                aspectRatio={1}
                h="full"
                rounded="full"
                background="linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.2) 0%) 0% 0% no-repeat padding-box"
                backgroundColor="primary.400 !important"
                filter="brightness(1.05)"
                p="2vh"
                className="flex flex-col items-center justify-center"
                _groupHover={{
                  background:
                    'linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.1) 0%) 0% 0% no-repeat padding-box',
                }}
                _hover={{
                  background:
                    'linear-gradient(45deg, black 0%, rgba(255, 255, 255, 0.1) 0%) 0% 0% no-repeat padding-box',
                }}
                pos="relative"
              >
                <Icon
                  as={SvgUpload}
                  w="70%"
                  maxW="100px"
                  h="auto"
                  transform={
                    isDragging ? 'translateY(-15px)' : 'translateY(0px)'
                  }
                  transitionProperty="transform"
                  transitionTimingFunction="ease-in"
                  transitionDelay="50ms"
                  transitionDuration="300ms"
                  sx={{ '& path': { fill: 'primary.500' } }}
                  _groupHover={{
                    transform: 'translateY(-10px)',
                  }}
                />
                <Switch>
                  <Case condition={isDragging}>
                    <Box
                      color="gray.900"
                      w="full"
                      maxW="162px"
                      fontSize="sm"
                      textAlign="center"
                      fontWeight="normal"
                      mt="7"
                    >
                      {t('file-incoming')}
                    </Box>
                  </Case>
                  <Default>
                    <Box
                      color="gray.900"
                      w="full"
                      maxW="162px"
                      fontSize="sm"
                      textAlign="center"
                      fontWeight="normal"
                      mt="7"
                    >
                      {t('drag-your-files-here-or-click-here-to-upload')}
                    </Box>
                  </Default>
                </Switch>
              </Box>
            </Box>
          </Box>
        </Else>
      </If>
      <Input
        type="file"
        id={`files-input-${uid}`}
        display="none"
        multiple={true}
        {...inputProps}
        onChange={(e) => {
          if (!e.target.files || !e.target.files?.length) return;
          setFiles(e.target.files);
        }}
      />
    </React.Fragment>
  );
};

export default UploadButton;
