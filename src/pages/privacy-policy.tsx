import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Img,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HeadFC } from 'gatsby';
import { SEO } from '../components/SEO';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

import pointingPerson from '../static/pointingPerson.png';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <Layout bgColor="#fafafa">
      <Navbar />
      <Box
        bgColor="primary.100"
        w="full"
        className="flex flex-col"
        mt="calc(-1 * var(--nav-height))"
        pt="var(--nav-height)"
      >
        <Container
          maxW="container.2xl"
          className="flex items-center flex-wrap"
          py="40px"
          pos="relative"
          minH={{ base: '700px', md: '600px', lg: '750px', xl: '900px' }}
        >
          <Stack
            spacing={9}
            flex={1}
            maxW={{ base: 'full', lg: '50%' }}
            minW="min(100%, 500px)"
          >
            <Box
              className="flex flex-col"
              color="primary.500"
              lineHeight={1}
              fontWeight="normal"
            >
              <Heading
                as="h1"
                fontWeight="normal"
                fontSize={{ base: '5xl', xl: '71px' }}
              >
                Data & Privacy Policy
              </Heading>
            </Box>
            <Box className="flex flex-col">
              <Text
                color="primary.500"
                fontSize={{ base: 'xl', md: '2xl', xl: '3xl' }}
              >
                Why should I choose TORNADO?
              </Text>
              <Text
                color="gray.600"
                fontSize={{ base: 'xl', md: '2xl', xl: '3xl' }}
                lineHeight={1.1}
                letterSpacing={1}
                mt="3"
              >
                With our Plan TORNADO you will get access to all of the Features
                & Tools immediately. This will help you to have full experience
                for a low price. You can upgrade or downgrade Storage with just
                few clicks.
              </Text>
            </Box>
          </Stack>
          <Box
            as={Img}
            src={pointingPerson}
            alt="transfer person"
            w={{ base: '80%', lg: '60%' }}
            aspectRatio={1}
            pos={{ base: 'static', lg: 'absolute' }}
            right={0}
          />
        </Container>
      </Box>
      <Container maxW="container.2xl" py="208px">
        <Text fontSize="27px">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </Text>
        <Text fontSize="27px" mt="107px">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </Text>
      </Container>
      <Box bgColor="primary.500">
        <Container
          maxW="container.2xl"
          py="20"
          className="flex items-center justify-between flex-wrap"
          gap={4}
        >
          <Text
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            color="white"
            lineHeight={1.2}
          >
            We don't transfer,
            <br />
            We deliver
          </Text>
          <Button
            variant="outline"
            color="white"
            borderColor="white !important"
            size="lg"
            h="71px"
            fontSize={{ base: '24px', lg: '36px' }}
          >
            Register now for free!
          </Button>
        </Container>
      </Box>
      <Footer />
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO />;
