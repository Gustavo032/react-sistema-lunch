import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex, Icon, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useToast, Image, Text, FormLabel } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [userTotalPrices, setUserTotalPrices] = useState<any>({});
	const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
	const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const toast = useToast(); // Adicionando o hook useToast
	
	/* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, [selectedMonth, selectedYear]);

  const fetchUsers = async () => {
		try {
			const token = document.cookie.replace(
				/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
				'$1'
			);
	
			const response = await axios.get(`http://localhost:3333/users/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const fetchedUsers = response.data.users.user;
			setUsers(fetchedUsers);
	
			// Fetch total price sum for each user
			const userTotalPricePromises = fetchedUsers.map((user:any) => {
				return axios.get(`http://localhost:3333/total-price-sum/${user.id}/${String(selectedMonth)}/${String(selectedYear)}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			});
	
			const totalPricesResponses = await Promise.all(userTotalPricePromises);
			const userTotalPricesData = totalPricesResponses.reduce((acc, response, index) => {
				acc[fetchedUsers[index].id] = response.data.totalPriceSum;
				return acc;
			}, {});
	
			setUserTotalPrices(userTotalPricesData);
		} catch (error) {
			console.error('Erro ao buscar usuários:', error);
		}
	};
	

  const handleSelectUser = (userId:any) => {
    onSelectUser(userId);
  };

  const handleFilterName = (event:any) => {
    const value = event.target.value;
    setFilterName(value);
  };

  const handleFilterId = (event:any) => {
    const value = event.target.value;
    setFilterId(value);
  };

	const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const filteredUsers = users.filter((user:any) => {
    return user.name.toLowerCase().includes(filterName.toLowerCase()) && user.id.includes(filterId);
  });
	const { onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null); // Specify the correct type
	
	const token = document.cookie.replace(
		/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
		'$1'
	);

	const handleDeleteUser = async (userId: string) => {
		onClose()

		try {
			await axios.delete(`http://localhost:3333/users/${userId}/delete`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Após a exclusão bem-sucedida, exiba o toast de sucesso e atualize a lista de usuários
			toast({
				title: 'Usuário excluído com sucesso!',
				status: 'success',
				duration: 3000, // Duração do toast em milissegundos
				isClosable: true,
			});
			fetchUsers();
		} catch (error) {
			console.error('Erro ao excluir usuário:', error);
		}
	};
	

  return (
    <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
      <Flex mb="4" w="100%" justifyContent={"space-between"}>
        <Flex w="30%" justify={"center"}>
					<Input placeholder="Filtrar por ID" value={filterId} _placeholder={{color:"gray.700"}} border="solid black 0.06rem" _focus={{backgroundColor: "#fff"}} bgColor={"gray.200"} onChange={handleFilterId} mr="2" />
					<Input placeholder="Filtrar por nome" value={filterName} _placeholder={{color:"gray.700"}} border="solid black 0.06rem" _focus={{backgroundColor: "#fff"}} bgColor={"gray.200"} onChange={handleFilterName} />
				</Flex>

				<Flex justify="center" bgColor="gray.100"  w="20%" borderRadius="9999999px">
					<Image src="/Logo_Maple_Bear.png" h="3rem" />
				</Flex>

				<Flex w="30%" justify={"center"}>
					<Flex width="100%" h="100%" align={"center"} ml="2" bgColor="gray.300" p="0 1rem" border="solid gray 0.05rem" borderRadius={"0.25rem"} justify={"center"}>
						<Text as={FormLabel} mt="0.5rem" htmlFor="inputMes" mr="1rem">Mês:</Text>
						<Input
							id="inputMes"
							type="number"
							min="1"
							max="12"
							bgColor="#fff"
							placeholder="Mês"
							border="solid 0.12rem black"
							value={selectedMonth}
							onChange={(e) => {
								setSelectedMonth(e.target.value);
								fetchUsers(); // Chama fetchUsers quando o valor do mês é alterado
							}}
						/>
					</Flex>

					<Flex width="100%" h="100%" alignItems="center" ml="2" bgColor="gray.300" p="0 1rem" border="solid gray 0.05rem" borderRadius={"0.25rem"} justify={"center"}>
						<Text as={FormLabel} mt="0.5rem" htmlFor="inputAno"  mr="1rem">Ano:</Text>
						<Input
							id="inputAno"
							type="number"
							placeholder="Ano"
							bgColor="#fff"
							border="solid 0.12rem black"
							value={selectedYear}
							onChange={(e) => {
								setSelectedYear(e.target.value);
								fetchUsers(); // Chama fetchUsers quando o valor do ano é alterado
							}}
						/>
					</Flex>

					
				</Flex>

      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Fatura Total</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
        {filteredUsers.map((user:any, index:number) => (
					<Tr key={index}>
						<Td>{user.id}</Td>
						<Td>{user.name}</Td>
						<Td>{formatPrice(userTotalPrices[user.id] || 0)}</Td>
						<Td>
							<Button onClick={() => handleSelectUser(user.id)} bgColor="blue.400">Selecionar</Button>
						</Td>
						<Td>
							<Button onClick={() => setSelectedUserId(user.id)} bgColor="red.400"><Icon as={FaTrash} w="1rem" size="1rem"/></Button>
							<AlertDialog
								motionPreset='slideInBottom'
								leastDestructiveRef={cancelRef}
								onClose={onClose}
								isOpen={selectedUserId === user.id} // Verifica se o diálogo está aberto para este usuário
								isCentered
							>
								<AlertDialogOverlay />
								<AlertDialogContent>
									<AlertDialogHeader>Discard User?</AlertDialogHeader>
									<AlertDialogCloseButton />
									<AlertDialogBody>
										Are you sure you want to discard this user? All data for that user will be deleted.
									</AlertDialogBody>
									<AlertDialogFooter>
										<Button ref={cancelRef} onClick={() => setSelectedUserId(null)}>
											No
										</Button>
										<Button colorScheme='red' ml={3} onClick={() => handleDeleteUser(user.id)}>
											Yes
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</Td>
					</Tr>
				))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
