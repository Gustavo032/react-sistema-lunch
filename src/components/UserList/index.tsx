import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import imageCompression from 'browser-image-compression';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex, Icon, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useToast, Image, Text, FormLabel, FormControl, Select, Stack, Heading, Center, Avatar, AvatarBadge, IconButton, useColorModeValue, Checkbox, Spinner, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ReactDatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [userTotalPrices, setUserTotalPrices] = useState<any>({});
  const [parentsEnabled, setParentsEnabled] = useState(false); // Estado para habilitar/desabilitar campos dos pais
  // const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [startDate, setStartDate] = useState<Date | null>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>({
		image: null
	});
	const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading
	const [showPassword, setShowPassword] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const toast = useToast();
  const cancelRef = useRef(null);
  const { onClose } = useDisclosure();

  useEffect(() => {
		// if (selectedMonth.length >= 1 && selectedYear.length >= 4) {
    	fetchUsers();
		// }
  }, [startDate, endDate]);

  const fetchUsers = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
				params: {
          // page: currentPage,
          // userId: userId,
          startDate: startDate ? format(startDate, 'MM/dd/yyyy') : null,
          endDate: endDate ? format(endDate, 'MM/dd/yyyy') : null,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedUsers = response.data.users.user;
      setUsers(fetchedUsers);

			fetchedUsers.sort((a:any, b:any) => {
				const nameA = a.name.toLowerCase();
				const nameB = b.name.toLowerCase();
				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;
				return 0;
			});
		

      const userTotalPricePromises = fetchedUsers.map((user:any) => {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/total-price-sum/${user.id}/${String(startDate)}/${String(endDate)}`, {
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

	const handleStartDateChange = (date:any) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    setStartDate(startOfDay);
  };

  const handleEndDateChange = (date:any) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    setEndDate(endOfDay);
  };

  const handleModifyUser = (user:any) => {
    setSelectedUser(user);
    setIsModifyModalOpen(true);
  };

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
		setImagePreview(null)
  };

  const handleFilterName = (event:any) => {
    const value = event.target.value;
    setFilterName(value);
  };

  const handleFilterId = (event:any) => {
    const value = event.target.value;
    setFilterId(value);
  };

  const formatPrice = (price:any) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const filteredUsers = users.filter((user:any) => {
    return user.name.toLowerCase().includes(filterName.toLowerCase()) && user.id.includes(filterId);
  });

  const handleImageChange = async (e:any) => {
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
				const reader = new FileReader();
				reader.onload = () => {
					setImagePreview(reader.result);
					setSelectedUser({ ...selectedUser, image: reader.result });
				};
				reader.readAsDataURL(compressedFile);
			} else {
				const reader = new FileReader();
				reader.onload = () => {
					setImagePreview(reader.result);
					setSelectedUser({ ...selectedUser, image: reader.result });
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

  const handleDeleteUser = async (userId:any) => {
    onClose();
    try {
			const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Usuário excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const handleUpdateUser = async (updatedUser:any) => {
    try {
			const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${updatedUser.id}/update`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Usuário atualizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
      handleCloseModifyModal();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

	// Função para buscar todos os usuários
  // useEffect(() => {

	// 	const token = document.cookie.replace(
	// 		/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
	// 		'$1'
	// 	);

	// 	const response = async axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
	// 		params: {
	// 			// page: currentPage,
	// 			// userId: userId,
	// 			startDate: startDate ? format(startDate, 'MM/dd/yyyy') : null,
	// 			endDate: endDate ? format(endDate, 'MM/dd/yyyy') : null,
	// 		},
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})

	// }, [])

  //   axios.get('/api/users')
  //     .then((response) => setUsers(response.data))
  //     .catch((error) => console.error(error));
  // }, []);

  // Função para buscar todos os pedidos de um usuário específico
  const fetchOrdersByUser = async (userId:any) => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/requests/history`, {
        params: {
          page: 1,
          userId: userId,
          startDate: startDate ? format(startDate, 'MM/dd/yyyy') : null,
          endDate: endDate ? format(endDate, 'MM/dd/yyyy') : null,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.requests;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Função para exportar os pedidos de todos os usuários em um único arquivo Excel
  const exportAllOrdersToExcel = async () => {
    setIsLoading(true); // Mostrar spinner
    const allOrders:any = [];

    const formatCurrency = (value:any) => {
      return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    for (const user of users) {
      const orders = await fetchOrdersByUser((user as any).id);

      orders.forEach((order:any) => {
        allOrders.push({
          OrderId: order.id,
          UserId: (user as any).id,
          UserRole: (user as any).role,
          UserName: (user as any).name,
          OrderItems: order.requestItems.map((item:any) => `${item.itemTitle} - ${formatCurrency(item.itemPrice)} `).join("\n"),
          OrderTotal: formatCurrency(order.total_price),
          OrderDate: format(new Date(order.created_at), 'dd/MM/yyyy HH:mm:ss')
        });
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(allOrders);
    for (let rowIndex = 0; rowIndex < allOrders.length; rowIndex++) {
      const cellAddress = `C${rowIndex + 2}`;
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          alignment: {
            wrapText: true
          }
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

    XLSX.writeFile(workbook, 'todos_pedidos.xlsx');
    setIsLoading(false); // Esconder spinner após download
  };
  const totalFatura = Object.values(userTotalPrices).reduce((sum:any, price:any) => sum + price, 0);

  return (
    <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
      <Flex mb="4" w="100%" justifyContent={"space-between"} alignItems="center">
				<Flex w={{ base: "100%", md: "30%" }} justify={{ base: "center", md: "flex-start" }} display={{ base: "none", md: "flex" }}>
					<Input placeholder="Filtrar por ID" value={filterId} _placeholder={{ color: "gray.700" }} border="solid black 0.06rem" _focus={{ backgroundColor: "#fff" }} bgColor={"gray.200"} onChange={handleFilterId} mr="2" />
					<Input placeholder="Filtrar por nome" value={filterName} _placeholder={{ color: "gray.700" }} border="solid black 0.06rem" _focus={{ backgroundColor: "#fff" }} bgColor={"gray.200"} onChange={handleFilterName} />
				</Flex>

				<Box>
						{isLoading ? <Spinner size="lg" /> : 
						<Button colorScheme="green" mb={4} onClick={exportAllOrdersToExcel}>
							Exportar Todos os Pedidos
						</Button>
						}
				</Box>


				{/* <Flex w={{ base: "100%", md: "30%" }} justify="center"> */}
					<Flex w={{ base: "100%", md: "50%" }} align="center" mt={{ base: 2, md: 0 }}>
						<Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
							<Text as={FormLabel} mt="0.5rem" htmlFor="inputDateStart" mr="2">Data Inicial:</Text>
							<Box as={ReactDatePicker} id="inputDateStart" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={startDate} onChange={handleStartDateChange} dateFormat="dd/MM/yyyy" />
						</Flex>
						
						<Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
							<Text as={FormLabel} mt="0.5rem" htmlFor="inputDateEnd" ml="2" mr="2">Data Final:</Text>
							<Box as={ReactDatePicker} id="inputDateEnd" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={endDate} onChange={handleEndDateChange} dateFormat="dd/MM/yyyy" />
						</Flex>
					</Flex>
				{/* </Flex> */}
      </Flex>
			<Box style={{ overflowX: 'auto' }}>
				<Table variant="simple">
					<Thead>
						<Tr>
							{/* <Th>ID</Th> */}
							<Th>Foto</Th>
							<Th>Nome</Th>
							<Th>Fatura Total <Text fontSize="1.20rem" color="blue.500" fontWeight="600">{formatPrice(totalFatura)}</Text></Th>
							<Th>Responsável</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody >
						{filteredUsers.map((user:any) => (
							<Tr key={user.id}>
								{/* <Td>{user.id}</Td> */}
								<Td><Image w="3rem" h="3rem" src={user.image}/></Td>
								<Td>{user.name}</Td>
								<Td>{formatPrice(userTotalPrices[user.id] || 0)}</Td>
								<Td>
									{user.father_name && <div>{user.father_name} (pai)</div>}
									{user.mother_name && <div>{user.mother_name} (mãe)</div>}
									 {/* <div>{user.father_number} </div> */}
									{!user.father_name && !user.mother_name && <div>não cadastrado</div>}
								</Td>
								<Td>
									<Button size="sm" colorScheme="blue" mr="2" onClick={() => handleModifyUser(user)} leftIcon={<FaEdit />}>Editar</Button>
									<Button size="sm" colorScheme="red" onClick={() => setSelectedUserId(user.id)} leftIcon={<FaTrash />}>Excluir</Button>
								</Td>
								<Td>
									<Button onClick={() => handleSelectUser(user.id)} bgColor="teal.500" color="white">Ver Detalhes</Button>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
      <AlertDialog
        isOpen={selectedUserId !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setSelectedUserId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Excluir Usuário</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>Tem certeza que deseja excluir este usuário?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setSelectedUserId(null)}>Cancelar</Button>
							<Button colorScheme='red' ml={3} onClick={() => {handleDeleteUser(selectedUserId); setSelectedUserId(null);}}>Excluir</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
			<AlertDialog isOpen={isModifyModalOpen} leastDestructiveRef={cancelRef} onClose={handleCloseModifyModal}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Editar Usuário:
							<br />
							<Text as={"span"} color="gray.500">{selectedUser.id}</Text>
						</AlertDialogHeader>
						<AlertDialogCloseButton />
						<AlertDialogBody>
							<Center w="full" py={6}>
								<Box w="full" bg={useColorModeValue('white', 'gray.800')} rounded="lg" p={6}>
									{loading && (
										<>
											<Text>Aguarde enquanto a imagem é processada</Text>
											<Spinner size="sm" color="blue.500" />
										</>
									)}
									{!loading && (
										<Stack direction={['column', 'row']} spacing={6}>
											<Center>
												<Avatar size="xl" src={imagePreview ? imagePreview : selectedUser.image}>
													<AvatarBadge
														as={IconButton}
														size="sm"
														rounded="full"
														top="-10px"
														colorScheme="red"
														aria-label="remove Image"
														icon={<SmallCloseIcon p="0.2rem" w="100%" h="100%" onClick={() => { setImagePreview(null); setSelectedUser({ ...selectedUser, image: null }) }} />}
													/>
												</Avatar>
											</Center>
											<Center w="100%">
												<Input p="0.1rem" required={!selectedUser.image} onChange={handleImageChange} alignContent={"center"} type="file" w="59%" border="none" />
											</Center>
										</Stack>
									)}

									<Stack spacing={4} mt={8}>
										<FormControl>
											<FormLabel>Nome</FormLabel>
											<Input
												required
												value={selectedUser.name || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>CPF</FormLabel>
											<Input
												value={selectedUser.cpf || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, cpf: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Matricula</FormLabel>
											<Input
												value={selectedUser.matricula || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, matricula: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Email</FormLabel>
											<Input
												value={selectedUser.email || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Senha</FormLabel>
											{/* <Input
												value={selectedUser.password || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
											/> */}
											<InputGroup>
												<Input
													required
													type={showPassword ? 'text' : 'password'} // Altere o tipo de texto para senha
													bg={'gray.100'}
													placeholder="Digite a Senha"
													border={0}
													color={'gray.900'}
													_placeholder={{
														color: 'gray.500',
													}}
													value={selectedUser.password || ''}
													onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
													maxLength={120}
												/>
												<InputRightElement>
													<IconButton
														variant="link"
														aria-label={showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
														icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
														onClick={() => setShowPassword(!showPassword)}
													/>
												</InputRightElement>
											</InputGroup>
										</FormControl>
										{/* <FormControl>
											<FormLabel>Limite de crédito</FormLabel>
											<Input
												type="number"
												value={selectedUser.credit_limit || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, credit_limit: e.target.value })}
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
											<FormLabel color="gray.800">Nome Completo do Pai</FormLabel>
											<Input
												type="text"
												bg={'gray.100'}
												placeholder="Digite o Nome do Pai"
												border={0}
												color={'gray.900'}
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.father_name || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, father_name: e.target.value })}
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
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.father_email || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, father_email: e.target.value })}
												maxLength={120}
											/>
										</FormControl>

										<FormControl id="father_number" display={parentsEnabled ? 'block' : 'none'}>
											<FormLabel color="gray.800">Telefone do Pai</FormLabel>
											<Input
												type="text"
												bg={'gray.100'}
												placeholder="Digite o Telefone do Pai"
												border={0}
												color={'gray.900'}
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.father_number || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, father_number: e.target.value })}
												maxLength={120}
											/>
										</FormControl>

										<FormControl id="mother_name" display={parentsEnabled ? 'block' : 'none'}>
											<FormLabel color="gray.800">Nome Completo da Mãe</FormLabel>
											<Input
												type="text"
												bg={'gray.100'}
												placeholder="Digite o Nome da Mãe"
												border={0}
												color={'gray.900'}
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.mother_name || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, mother_name: e.target.value })}
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
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.mother_email || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, mother_email: e.target.value })}
												maxLength={120}
											/>
										</FormControl>
										
										<FormControl id="mother_number" display={parentsEnabled ? 'block' : 'none'}>
											<FormLabel color="gray.800">Telefone da Mãe</FormLabel>
											<Input
												type="text"
												bg={'gray.100'}
												placeholder="Digite o Telefone da Mãe"
												border={0}
												color={'gray.900'}
												_placeholder={{ color: 'gray.500' }}
												value={selectedUser.mother_number || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, mother_number: e.target.value })}
												maxLength={120}
											/>
										</FormControl>

										<FormControl>
											<FormLabel>Função</FormLabel>
											<Select
												value={selectedUser.role || ''}
												onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
											>
												<option value="ADMIN">Administrador</option>
												<option value="MIDDLE">Cantina</option>
												<option value="PROF">Professor</option>
												<option value="MEMBER">Aluno</option>
											</Select>
										</FormControl>
									</Stack>
								</Box>
							</Center>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={handleCloseModifyModal}>Cancelar</Button>
							<Button colorScheme="blue" type="submit" ml={3} onClick={()=>{
									if (!selectedUser.image) {
										toast({
											title: "Imagem necessária",
											description: "Por favor, adicione uma imagem antes de salvar.",
											status: "warning",
											duration: 5000,
											isClosable: true,
										});
										return;
									}
									handleUpdateUser(selectedUser);
									setImagePreview(null);
							}}>Salvar</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
    </Box>
  );
};

export default UserList;
