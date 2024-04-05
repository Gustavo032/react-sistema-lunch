import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

export default function LoginScreen() {
  const [userCpf, setUserCpf] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function loginUserFunction() {
    try {
      const response = await axios.post('http://localhost:3333/sessions', {
        cpf: userCpf.replace(/\D/g, ''), // Remove todos os caracteres não numéricos
      });

      if (response.data.token) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // Expira em 7 dias

        document.cookie = `refreshToken=${response.data.token};expires=${expirationDate.toUTCString()};path=/`;
        navigate('/dashboard');
      } else {
        setErrorMessage("Falha ao Conectar ");
        console.error('Token not found in response');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Falha ao Conectar " + error);
    }
  }

  const handleCpfChange = (e:any) => {
    const inputCpf = e.target.value;
    let formattedCpf = inputCpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Formata o CPF conforme o usuário digita
    if (formattedCpf.length > 3) {
      formattedCpf = formattedCpf.replace(/^(\d{3})/, '$1.');
    }
    if (formattedCpf.length > 7) {
      formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
    }
    if (formattedCpf.length > 11) {
      formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
    }

    setUserCpf(formattedCpf);
  };

  const handleLogin = async (event:any) => {
    event.preventDefault();
    await loginUserFunction();
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      backgroundImage="./img/mapleBearBackground.jpg"
      bgSize="cover"
      bgPosition="center"
      position="relative" // Para posicionar elementos filhos relativos a este
    >
			<Text
				position="absolute"
				top="4"
				left="4"
				color="white"
				fontSize="2xl"
				zIndex="2" // Ajusta a camada de empilhamento para que o texto esteja sobre o overlay
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
        bg="rgba(0, 0, 0, 0.5)" // Define um overlay escuro
        zIndex="1" // Ajusta a camada de empilhamento
      ></Flex>

      <Stack
        className="meuBackground com opacity"
        spacing={4}
        w={'full'}
        maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
        as="form"
        onSubmit={handleLogin}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2" // Ajusta a camada de empilhamento para que o formulário esteja sobre o overlay escuro
        position="relative" // Define a posição relativa para que o zIndex funcione corretamente
				border="#fff solid 0.12rem"
			>
        <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Faça seu pedido
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.800')}
        ></Text>
        <FormControl id="email">
          <FormLabel color="gray.800">CPF</FormLabel>
          <Input
            type="text"
            inputMode="numeric"
            bg={'gray.100'}
            placeholder="Digite seu CPF"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userCpf}
            onChange={handleCpfChange}
            maxLength={14}
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
    </Flex>
  );
}
