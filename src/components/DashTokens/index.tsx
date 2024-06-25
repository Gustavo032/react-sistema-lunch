import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Button, 
  Flex, 
  Text, 
  Stack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const DashTokens = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tokens, setTokens] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
    };

    const userRole = getCookie('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }

    fetchTokens();
  }, [navigate]);

  const fetchTokens = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/tokens`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTokens(response.data);
    } catch (error) {
      console.error('Erro ao buscar tokens:', error);
    }
  };

  const createToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/generateToken`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTokens(prevTokens => [...prevTokens, response.data.createdToken]);
      toast({
        title: "Token criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao criar token:', error);
      toast({
        title: "Erro ao criar token.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
        position="fixed"
        top="4"
        left="4"
        color="white"
        fontSize="2xl"
        zIndex="3" // Ajusta a camada de empilhamento para que o texto esteja sobre o overlay
				bgColor="#00000080"
				p="1rem"
				borderRadius="5rem"
      >
        <Button
          colorScheme="whiteAlpha"
          onClick={() => navigate('/admin')}
          zIndex="2"
          mr="1rem"
          _hover={{ bg: 'whiteAlpha.800' }}
          _active={{ bg: 'whiteAlpha.600' }}
        >
          <ArrowBackIcon color="white" boxSize={6} />
        </Button>
        MapleBear Granja Viana
        {/* Botão de Voltar */}
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
        // maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={"8rem"}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2"
        position="relative"
        border="#fff solid 0.12rem"
        align="center"
      >
        <Text color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Lista de Tokens
        </Text>

        <Button colorScheme="teal" onClick={onOpen}>Adicionar Novo Token</Button>

        <Table variant="striped" colorScheme="white" bgColor="gray.100" border="solid 0.06rem black" mt={6}>
          <Thead>
            <Tr>
              <Th>Token</Th>
              <Th>E-mail</Th>
              <Th>Status</Th>
              <Th>Data de Criação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tokens.map((token: any) => (
              <Tr key={token.id}>
                <Td>{token.token}</Td>
                <Td>{token.email}</Td>
                <Td h="100%" p="0" textAlign="center">
                  {token.used ? (
                    <Text bgColor="#E53E3E" fontWeight={"500"} color={"white"} h="100%" p="1rem">Utilizado</Text>
                  ) : (
                    <Text h="100%" p="1rem" fontWeight={"500"} color={"white"} bgColor="green.500">Válido</Text>
                  )}
                </Td>
                <Td>{new Date(token.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Novo Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
              placeholder="Digite o e-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createToken} isLoading={loading}>
              Confirmar
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default DashTokens;
