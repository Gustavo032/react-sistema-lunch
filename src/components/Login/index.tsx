import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o useHistory
import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from '@chakra-ui/react';
import axios from 'axios';

export default function LoginScreen() {
  const [userCpf, setUserCpf] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  async function loginUserFunction() {
    try {
      const response = await axios.post('http://localhost:3333/sessions', {
        cpf: userCpf,
      });

      if (response.data.refreshToken) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // Expira em 7 dias

        document.cookie = `refreshToken=${response.data.refreshToken};expires=${expirationDate.toUTCString()};path=/`;
        navigate('/dashboard');
      } else {
        console.error('Token not found in response');
        // Lidar com o caso em que o token não está presente na resposta
      }
    } catch (error) {
      console.error('Error:', error);
      // Lidar com erros de solicitação, como erro de rede, etc.
    }
  }

  const handleLogin = async (event:any) => {
    event.preventDefault();
    await loginUserFunction();
  };

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack as="form" onSubmit={handleLogin} spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
          <FormControl id="cpf">
            <FormLabel>CPF</FormLabel>
            <Input
              type="text"
              value={userCpf}
              onChange={(e) => setUserCpf(e.target.value)}
            />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack>
            <Button type="submit" colorScheme={'blue'} variant={'solid'}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}
