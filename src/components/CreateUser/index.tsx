import React, { useEffect, useState } from 'react';
import { Avatar, AvatarBadge, Box, Button, Center, Checkbox, Flex, FormControl, FormLabel, Heading, IconButton, Image, Input, Select, Spinner, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export default function CreateUserScreen() {
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    cpf: '',
    password: '',
    credit: 0,
    role: 'MEMBER',
    image: null // Adicione um estado para armazenar a imagem em base64
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [parentsEnabled, setParentsEnabled] = useState(false); // Estado para habilitar/desabilitar campos dos pais
  const toast = useToast();
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  const [imagePreview, setImagePreview] = useState('');
	const [loading, setLoading] = useState(false);
	const turmas = [
		'Year 6',
		'Year 7',
		'Year 8',
		'Year 9',
		'Year 10',
		'Year 11',
		'Year 12',
	];

  const navigate = useNavigate();

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
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users`, userData, {
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

		
		// Limpar o valor do input para forçar o onChange ser disparado
		e.target.value = null;
	
    // Verificar se foi selecionado um arquivo
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.includes('image')) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

		setLoading(true); // Ativar o indicador de loading

    // Verificar o tamanho do arquivo
    
		try {
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
		} catch (error) {
			console.error('Erro ao processar a imagem:', error);
			alert('Ocorreu um erro ao processar a imagem. Por favor, tente novamente.');
		} finally {
			setLoading(false); // Desativar o indicador de loading, seja após sucesso ou erro
		}
  };

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
            Cadastrar Aluno
          </Heading>
          <Button as={Link} to="/controle" colorScheme="blue">Listar Alunos</Button>
        </Flex>

        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.800')}
        ></Text>

				{/* <Stack direction={['column', 'row']} spacing={6}>
					<Center>
						<Avatar size="xl"  src={imagePreview ? imagePreview : userData.image}>
							<AvatarBadge
								as={IconButton}
								size="sm"
								rounded="full"
								top="-10px"
								colorScheme="red"
								aria-label="remove Image"
								icon={<SmallCloseIcon onClick={() => setImagePreview('')}/>}
							/>
						</Avatar>
					</Center>
					<Center w="100%">
						<Input p="0.1rem" onChange={handleImageChange} alignContent={"center"} type="file" w="48%" border="none"/>
					</Center>
				</Stack> */}
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
											icon={<SmallCloseIcon p="0.2rem" w="100%" h="100%" onClick={() => {setImagePreview(''); setUserData({ ...userData, image: null})}}/>}
										/>
									</Avatar>
								</Center>
								<Center w="100%">
									<Input p="0.1rem" required={userData.image === null ? true : false} onChange={handleImageChange} alignContent={"center"} type="file" w="48%" border="none"/>
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

				<FormControl id="id">
          <FormLabel color="gray.800">Matricula</FormLabel>
          <Input
            type="text"
            bg={'gray.100'}
            placeholder="Digite a Matricula"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.id}
            onChange={(e)=>setUserData({ ...userData, id: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="name">
          <FormLabel color="gray.800">Nome*</FormLabel>
          <Input
						required
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

				<FormControl id="cpf">
          <FormLabel color="gray.800">CPF</FormLabel>
          <Input
						required
            type="text"
            bg={'gray.100'}
            placeholder="Digite o CPF"
            border={0}
            color={'gray.900'}
            _placeholder={{
              color: 'gray.500',
            }}
            value={userData.cpf}
            onChange={(e)=>setUserData({ ...userData, cpf: e.target.value })}
            maxLength={120}
          />
        </FormControl>

        <FormControl id="email">
          <FormLabel color="gray.800">Email*</FormLabel>
          <Input
						required
            type="email"
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
          <FormLabel color="gray.800">Senha*</FormLabel>
          <Input
						required
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

        {/* <FormControl id="credit">
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
        </FormControl> */}

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

        {/* <FormControl id="user_class">
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
        </FormControl> */}
				<FormControl id="user_class">
					<FormLabel color="gray.800">Turma do Aluno</FormLabel>
					<Select
						bg={'gray.100'}
						placeholder="Selecione a Turma do Aluno"
						border={0}
						color={'gray.900'}
						_placeholder={{
							color: 'gray.500',
						}}
						value={userData.user_class}
						onChange={(e) => setUserData({ ...userData, user_class: e.target.value })}
					>
						{turmas.map((turma) => (
							<option key={turma} value={turma}>
								{turma}
							</option>
						))}
					</Select>
				</FormControl>


        <FormControl id="role">
          <FormLabel color="gray.800">Função</FormLabel>
          <Select
						required
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
            <option value='MEMBER'>Aluno</option>
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
