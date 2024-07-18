import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Icon,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaRegCheckCircle } from 'react-icons/fa';

export default function LoginScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const currentUrl = window.location.href;

    // Check if the current URL is "https://react-sistema-lunch.vercel.app/ or https://maplebear.ineedti.com/"
    if (currentUrl === "https://maplebear.ineedti.com/" || currentUrl === "https://maplebear.ineedti.com/login" || currentUrl === "http://maplebear.ineedti.com" || currentUrl === "http://maplebear.ineedti.com/login") {
      setShowEmailLogin(true);
      return;
    }

    const params = new URLSearchParams(location.search);
    const endRequest = params.get('endRequest');
    if (endRequest === 'true') {
      setShowModal(true);
    }

    const urlBase = process.env.REACT_APP_API_BASE_URL ?? 'https://api-m.ineedti.com';

// Verifica o protocolo e ajusta para o protocolo WebSocket correspondente
		const wsProtocol = urlBase.startsWith('https:') ? 'wss:' : 'ws:';
		const socketUrl = `${wsProtocol}//${urlBase.split('//')[1]}`;
		const socket = new WebSocket(socketUrl);
    socket.onopen = function() {
      console.log('Conexão estabelecida.');
    };

    socket.onmessage = function(message) {
      console.log('Mensagem recebida do servidor WebSocket:', message);
      if (message.data) {
        const response = JSON.parse(message.data);
        console.log(response);

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        document.cookie = `refreshToken=${response.refreshToken};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = `userRole=${response.role};expires=${expirationDate.toUTCString()};path=/`;
        console.log(document.cookie);
        socket.close();
        navigate('/dashboard');
      }
    };

    socket.onclose = function(event) {
      console.log('Conexão fechada:', event);
    };

    socket.onerror = function(error) {
      console.error('Erro:', error);
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
        console.log('WebSocket connection closed.');
      }
    };
  }, [navigate, location.search]);

  async function loginUserFunction() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/sessions`, {
        email: userEmail,
        password: userPassword,
      });

      if (response.data.token) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        document.cookie = `refreshToken=${response.data.token};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = `userRole=${response.data.role};expires=${expirationDate.toUTCString()};path=/`;
      }
      if(response.data.role === 'ADMIN' || response.data.role === 'MIDDLE') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const handleLogin = async (event:any) => {
    event.preventDefault();
    try {
      if (!isSmallScreen) {
        await toast.promise(loginUserFunction(), {
          loading: { title: 'Entrando...', description: 'Por favor, aguarde...' },
          success: { title: 'Usuário logado com sucesso!', description: 'Looks great' },
          error: { title: 'Erro ao logar usuário', description: 'Something wrong' },
        });
      } else {
        await loginUserFunction();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

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
          Faça seu pedido
        </Heading>
        {!showEmailLogin && !isSmallScreen ? (
          <>
            <Text
              fontSize={{ base: 'sm', sm: 'md' }}
              color={"gray.800"}
              textAlign="center"
            >
              Aproxima-se do leitor facial para continuar.
            </Text>
            <Spinner />
            <Button
              mt={4}
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
              onClick={() => setShowEmailLogin(true)}
            >
              Entrar com Email
            </Button>
          </>
        ) : (
          <Stack
            spacing={4}
            w={'full'}
            as="form"
            onSubmit={handleLogin}
          >
            <FormControl id="email">
              <FormLabel color="gray.800">Email</FormLabel>
              <Input
                type="email"
                bg={'gray.100'}
                placeholder="Digite seu Email"
                border={0}
                color={'gray.900'}
                _placeholder={{
                  color: 'gray.500',
                }}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel color="gray.800">Senha</FormLabel>
              <Input
                type="password"
                bg={'gray.100'}
                placeholder="Digite sua Senha"
                border={0}
                color={'gray.900'}
                _placeholder={{
                  color: 'gray.500',
                }}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Button
                type="submit"
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
              >
                Continuar
              </Button>
              {!isSmallScreen && (
                <Button
                  mt={-4}
                  color={'white'}
                  bgColor={'blue.500'}
                  _hover={{
                    bgColor: 'blue',
                    opacity: 0.5,
                  }}
                  _active={{
                    bgColor: 'blue.300',
                  }}
                  variant={'solid'}
                  onClick={() => setShowEmailLogin(false)}
                >
                  Entrar com Facial
                </Button>
              )}
              {errorMessage !== '' && (
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Text color="gray.800">{`${errorMessage}`}</Text>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
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
