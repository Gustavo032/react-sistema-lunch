import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarBadge, Box, Button, Center, Checkbox, Flex, FormControl, FormLabel, Heading, IconButton, Input, Select, Spinner, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export default function CreateUserByToken() {
  const { TokenID } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isValidToken, setIsValidToken] = useState(false);
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    password: '',
    credit: '',
    role: 'MEMBER',
    image: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [parentsEnabled, setParentsEnabled] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>('');
	const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/users/verify-token/${TokenID}`);
        if (response.data.message === 'Valid token') {
          setIsValidToken(true);
        } else {
          // navigate('/invalid-token'); // Redirecionar para uma página de token inválido
					console.log("token invalid");
				}
      } catch (error) {
				console.log(error);
        // navigate('/invalid-token'); // Redirecionar para uma página de token inválido
      }
    };

    validateToken();
  }, [TokenID, navigate]);

  const createUser = async () => {
    try {
      const response = await axios.post(`http://localhost:3333/users/${TokenID}/registerToken`, userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('User created successfully:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await toast.promise(createUser(), {
        loading: { title: 'Criando usuário...', description: 'Por favor, aguarde...' },
        success: { title: 'Usuário criado com sucesso!', description: 'Looks great' },
        error: { title: 'Erro ao criar usuário', description: 'Something wrong' },
      });
    } catch (error:any) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message);
    }
  };

  const handleImageChange = async (e: any) => {
		const file = e.target.files[0];
		
		// Limpar o valor do input para forçar o onChange ser disparado
		e.target.value = null;
	
		if (!file) return;
		if (!file.type.includes('image')) {
			alert('Por favor, selecione uma imagem.');
			return;
		}
	
		setLoading(true); // Ativar o indicador de loading
	
		try {
			if (file.size > 200 * 1024) {
				const compressedFile = await imageCompression(file, { maxSizeMB: 0.1 });
				const reader: any = new FileReader();
				reader.onload = () => {
					setImagePreview(reader.result);
					setUserData({ ...userData, image: reader.result });
				};
				reader.readAsDataURL(compressedFile);
			} else {
				const reader: any = new FileReader();
				reader.onload = () => {
					setImagePreview(reader.result);
					setUserData({ ...userData, image: reader.result });
				};
				reader.readAsDataURL(file);
			}
		} catch (error) {
			console.error('Erro ao processar a imagem:', error);
			alert('Ocorreu um erro ao processar a imagem. Por favor, tente novamente.');
		} finally {
			setLoading(false); // Desativar o indicador de loading, seja após sucesso ou erro
		}
	};
	
  if (!isValidToken) {
    return <Center>Verificando token...</Center>;
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
			backgroundAttachment={"fixed"}
      backgroundImage="/img/mapleBearBackground.jpg"
      bgSize="cover"
      bgPosition="center"
      position="relative" // Para posicionar elementos filhos relativos a este
    >
      <Text
        position="fixed"
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
        <Flex justifyContent={"space-between"}>
          <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Criar Usuário
          </Heading>
        </Flex>

        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={"gray.800"}
        ></Text>

				<Stack direction={['column', 'row']} spacing={6}>
					{/* Se loading for true, exibe o Spinner */}
    {loading && <><Text>Aguarde enquanto a imagem é processada </Text><Spinner size="sm" color="blue.500" /></>}
    
    {/* Se não estiver carregando, exibe o restante do conteúdo */}
    {!loading && (
      <>
        <Center>
						<Avatar size="xl"  src={imagePreview}>
							<AvatarBadge
								as={IconButton}
								size="sm"
								rounded="full"
								top="-10px"
								colorScheme="red"
								aria-label="remove Image"
								icon={<SmallCloseIcon p="0.2rem" w="100%" h="100%" onClick={() => {setImagePreview(""); setUserData({ ...userData, image: "" })}}/>}
							/>
						</Avatar>
					</Center>
					<Center w="100%">
						<Input p="0.1rem" onChange={handleImageChange} alignContent={"center"} type="file" w="48%" border="none"/>
					</Center>
      </>
    )}

				</Stack>
        {/* <FormControl id="userImage">
          <FormLabel color="gray.800">Imagem do Usuário</FormLabel>
					<Flex>
						{imagePreview && (
							<Box mt={2} border="0.06rem white solid">
								<Image src={imagePreview} alt="Preview" maxW="200px" maxH="200px" />
							</Box>
						)}
						<Input type="file" alignContent={"center"} onChange={handleImageChange} />
					</Flex>
        </FormControl> */}

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
            type="password" // Altere o tipo de texto para senha
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

        <Checkbox
          isChecked={parentsEnabled}
          onChange={() => setParentsEnabled(!parentsEnabled)}
          colorScheme="blue"
          my={4}
					borderRadius={"1rem"}
					p="0.5rem 1rem"
					fontWeight={400}
					color="#fff"
					bgColor="#E53E3E"
        >
          Incluir dados dos pais
        </Checkbox>

        <FormControl id="father_name" display={parentsEnabled ? 'block' : 'none'}>
          <FormLabel color="gray.800">Nome do Pai</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite o Nome do Pai"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.father_name}
            onChange={(e)=>setUserData({ ...userData, father_name: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="father_email" display={parentsEnabled ? 'block' : 'none'}>
          <FormLabel color="gray.800">Email do Pai</FormLabel>
          <Input
            type="email"
            bg={'gray.100'}
            placeholder="Digite o Email do Pai"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.father_email}
            onChange={(e)=>setUserData({ ...userData, father_email: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="mother_name" display={parentsEnabled ? 'block' : 'none'}>
          <FormLabel color="gray.800">Nome da Mãe</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite o Nome da Mãe"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.mother_name}
            onChange={(e)=>setUserData({ ...userData, mother_name: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="mother_email" display={parentsEnabled ? 'block' : 'none'}>
          <FormLabel color="gray.800">Email da Mãe</FormLabel>
          <Input
            type="email"
            bg={'gray.100'}
            placeholder="Digite o Email da Mãe"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.mother_email}
            onChange={(e)=>setUserData({ ...userData, mother_email: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="user_class">
          <FormLabel color="gray.800">Turma do Usuário</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite a Turma do Usuário"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.user_class}
            onChange={(e)=>setUserData({ ...userData, user_class: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        {/* <FormControl id="role">
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
            <option value='MIDDLE'>Cantina</option>
            <option value='MEMBER'>Usuário</option>
          </Select>
        </FormControl> */}
        
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