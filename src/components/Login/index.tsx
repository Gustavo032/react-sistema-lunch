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
  const [errorMessage, setErrorMessage] = useState('');

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
				setErrorMessage("Falha ao Conectar " + response.data.errorMessage)
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
    <Stack minH={'100vh'} minW={"100vw"} bgColor={'white'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack as="form" color={'gray.900'} onSubmit={handleLogin} spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Digite o Seu CPF</Heading>
          <FormControl id="cpf">
            <FormLabel>CPF</FormLabel>
            <Input
              type="number"
							inputMode="numeric"
							bg={'gray.100'}
							placeholder='Digite seu CPF'
							border={0}
							color={'gray.900'}
							_placeholder={{
								color: 'gray.500',
							}}
              value={userCpf}
              onChange={(e) => setUserCpf(e.target.value)}
            />
          </FormControl>
          <Stack spacing={6}>
					<Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
								{errorMessage ?? (	
									<Text>
										{`${errorMessage}`}
									</Text>
								)
								}
            </Stack>
            <Button type="submit" color={'white'} bgColor={"red.500"} _hover={{
								bgColor: 'red',
								opacity: 0.5,
							}} _active={{
								bgColor: 'red.300',
							}} variant={'solid'}>
              Continuar
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            '/img/loginBg.jpg'
          }
        />
      </Flex>
    </Stack>
  );
}
