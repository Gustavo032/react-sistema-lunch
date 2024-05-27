import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegCheckCircle } from 'react-icons/fa';

export default function PresentationScreen() {
  const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const location = useLocation();


  const handleContinue = () => {
    navigate('/login');
  };

	useEffect(() => {
    const params = new URLSearchParams(location.search);
    const endRequest = params.get('endRequest');
    if (endRequest === 'true') {
      setShowModal(true);
    }
	},[location.search]);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      backgroundImage="./img/mapleBearBackground.jpg"
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
      <Text
        position="absolute"
        top="4"
        left="4"
        color="white"
        fontSize="2xl"
        zIndex="2"
      >
        MapleBear Granja Viana
      </Text>

      {/* Overlay escuro */}
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
      ></Flex>

      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2"
        position="relative"
        border="#fff solid 0.12rem"
        align="center"
      >
        <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Bem-vindo ao MapleBear
        </Heading>
        <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.800'} textAlign="center">
          A melhor plataforma de pedidos. Clique em "OK" para continuar para a tela de login.
        </Text>
        <Button
          color={'white'}
          bgColor={'red.500'}
          _hover={{
            bgColor: 'red',
            opacity: 0.5,
          }}
          _active={{
            bgColor: 'red.300',
          }}
          variant={'solid'}
          onClick={handleContinue}
        >
          OK
        </Button>
      </Stack>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="white"
          color="gray.800"
          borderRadius="xl"
          p={4}
          textAlign="center"
          boxShadow="md"
        >
          <ModalCloseButton color="gray.400" />
          <ModalHeader mt={4} fontSize="xl" fontWeight="bold">
            Obrigado pelo seu pedido!
          </ModalHeader>
          <ModalBody fontSize="md">
            <Flex flexDir={'column'}>
              <Icon as={FaRegCheckCircle} alignSelf={"center"} color="green.500" mt={1} fontSize="3xl" />
              Leve o ticket impresso ao refeitório
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent="center" mt={4}>
            <Button colorScheme="red" onClick={() => setShowModal(false)}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
