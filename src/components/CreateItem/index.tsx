import React, { useEffect, useState } from 'react';
import { Button, Flex, FormControl, FormLabel, Heading, Input, Select, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateItemScreen() {
  const [itemData, setItemData] = useState({
    title: '',
    price: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
	const toast = useToast();
	const token = document.cookie.replace(
		/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
		'$1'
	);
	
	const navigate = useNavigate();
	
	console.log(typeof token);
	useEffect(() => {
		if(token==="") {
			navigate('/');
		}
	},[])
	
  const createItem = async () => {
    try {

      const response = await axios.post('https://maplebear.codematch.com.br/items/create', itemData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
      console.log('Item created successfully:', response.data);
      setItemData({
        title: '',
        price: ''
      });
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw the error to be caught by the promise chain
    } 
  };


	const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // Exibir o toast de carregamento enquanto a promessa está pendente
      const result = await toast.promise(createItem(), {
        loading: { title: 'Criando item...', description: 'Por favor, aguarde...' },
        success: { title: 'Item criado com sucesso!', description: 'Looks great' },
        error: { title: 'Erro ao criar item', description: 'Something wrong' },
      });
      console.log(result); // Pode ser útil para depuração
    } catch (error:any) {
      console.error('Error creating item:', error);
      setErrorMessage(error.message);
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
			onSubmit={handleSubmit}
			bg="rgba(255, 255, 255, 0.8)"
			zIndex="2" // Ajusta a camada de empilhamento para que o formulário esteja sobre o overlay escuro
			position="relative" // Define a posição relativa para que o zIndex funcione corretamente
			border="#fff solid 0.12rem"
		>
			<Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
				Criar Item
			</Heading>
			<Text
				fontSize={{ base: 'sm', sm: 'md' }}
				color={useColorModeValue('gray.800', 'gray.800')}
			></Text>
			<FormControl id="title">
				<FormLabel color="gray.800">Título</FormLabel>
				<Input
					type="text"
					bg={'gray.100'}
					placeholder="Digite o Título"
					border={0}
					color={'gray.900'}
					_placeholder={{
						color: 'gray.500',
					}}
					value={itemData.title}
					onChange={(e)=>setItemData({ ...itemData, title: e.target.value })}
					maxLength={120}
				/>
			</FormControl>
			
			<FormControl id="price">
				<FormLabel color="gray.800">Preço</FormLabel>
				<Input
					type="number"
					bg={'gray.100'}
					placeholder="Digite o Preço"
					border={0}
					color={'gray.900'}
					_placeholder={{
						color: 'gray.500',
					}}
					value={itemData.price}
					onChange={(e)=>setItemData({ ...itemData, price: e.target.value })}
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
