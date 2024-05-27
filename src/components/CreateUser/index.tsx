import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Image, Input, Select, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function CreateUserScreen() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    credit: '',
    role: 'MEMBER',
    image: '' // Adicione um estado para armazenar a imagem em base64
  });
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  const [imagePreview, setImagePreview] = useState('');
  
  const navigate = useNavigate();
  
  console.log(typeof token);
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
  }, [navigate]);
  
  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3333/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Altere o tipo de conteúdo para application/json
        }
      });
      console.log('User created successfully:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be caught by the promise chain
    } 
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // Exibir o toast de carregamento enquanto a promessa está pendente
      const result = await toast.promise(createUser(), {
        loading: { title: 'Criando usuário...', description: 'Por favor, aguarde...' },
        success: { title: 'Usuário criado com sucesso!', description: 'Looks great' },
        error: { title: 'Erro ao criar usuário', description: 'Something wrong' },
      });

      console.log(result); // Pode ser útil para depuração
    } catch (error:any) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message);
    }
  };

  const handleImageChange = async (e:any) => {
    const file = e.target.files[0];

    // Verificar se foi selecionado um arquivo
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.includes('image')) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    // Verificar o tamanho do arquivo
    if (file.size > 200 * 1024) {
      // Se a imagem exceder 200KB, redimensioná-la
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.1 });
      // Exibir a imagem redimensionada
      const reader:any = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        // Converter a imagem para base64 e armazená-la no estado userData
        setUserData({ ...userData, image: reader.result });
      };
      reader.readAsDataURL(compressedFile);
    } else {
      // Exibir a imagem sem redimensionamento
      const reader:any = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        // Converter a imagem para base64 e armazená-la no estado userData
        setUserData({ ...userData, image: reader.result });
      };
      reader.readAsDataURL(file);
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
        onSubmit={handleSubmit}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2" // Ajusta a camada de empilhamento para que o formulário esteja sobre o overlay escuro
        position="relative" // Define a posição relativa para que o zIndex funcione corretamente
        border="#fff solid 0.12rem"
      >
        <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Criar Usuário
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.800')}
        ></Text>

        <FormControl id="userImage">
          <FormLabel color="gray.800">Imagem do Usuário</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {imagePreview && (
            <Box mt={2}>
              <Image src={imagePreview} alt="Preview" maxW="200px" maxH="200px" />
            </Box>
          )}
        </FormControl>

        <FormControl id="name">
          <FormLabel color="gray.800">Nome</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite o Nome"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.name}
            onChange={(e)=>setUserData({ ...userData, name: e.target.value })}
            maxLength={120}
          />
        </FormControl>
        
        <FormControl id="email">
          <FormLabel color="gray.800">Email</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite o Email"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.email}
            onChange={(e)=>setUserData({ ...userData, email: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel color="gray.800">Senha</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite a Senha"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.password}
            onChange={(e)=>setUserData({ ...userData, password: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="credit">
          <FormLabel color="gray.800">Crédito do Usuário</FormLabel>
          <Input
            type="number"
            inputMode="numeric"
            bg={'gray.100'}
            placeholder="Defina o Crédito do Usuário"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            step={0.01}
            value={userData.credit}
            onChange={(e)=>setUserData({ ...userData, credit: String(Number(parseFloat(e.target.value.replace(/[^0-9.]/g, '')).toFixed(2))) })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="role">
          <FormLabel color="gray.800">Função</FormLabel>
          <Select
            placeholder='Select option'
            bg={'gray.100'}
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.role}
            onChange={(e)=>setUserData({ ...userData, role: e.target.value })}
          >
            <option value='ADMIN'>Administrador</option>
            <option value='MEMBER'>Usuário</option>
          </Select>
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
