import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex, Icon, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useToast, Image, Text, FormLabel, FormControl, Select } from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [userTotalPrices, setUserTotalPrices] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>({});
	const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
	const [imagePreview, setImagePreview] = useState('');

  
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [selectedMonth, selectedYear]);

  const fetchUsers = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedUsers = response.data.users.user;
      setUsers(fetchedUsers);

      const userTotalPricePromises = fetchedUsers.map((user:any) => {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/total-price-sum/${user.id}/${String(selectedMonth)}/${String(selectedYear)}`, {
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

	const handleModifyUser = (user:any) => {
		setSelectedUser(user);
		setIsModifyModalOpen(true);
	};

	const handleCloseModifyModal = () => {
		setIsModifyModalOpen(false);
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

  const { onClose } = useDisclosure();
  const cancelRef = useRef(null);
  
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );


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
				// Atualizar o estado do usuário com a imagem
				setSelectedUser({ ...selectedUser, image: reader.result });
			};
			reader.readAsDataURL(compressedFile);
		} else {
			// Exibir a imagem sem redimensionamento
			const reader:any = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result);
				// Atualizar o estado do usuário com a imagem
				setSelectedUser({ ...selectedUser, image: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};
	

  const handleDeleteUser = async (userId:any) => {
    onClose();
    try {
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
	

  const totalFatura = Object.values(userTotalPrices).reduce((sum:any, price:any) => sum + price, 0);

  return (
    <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
      <Flex mb="4" w="100%" justifyContent={"space-between"}>
        <Flex w="30%" justify={"center"}>
          <Input placeholder="Filtrar por ID" value={filterId} _placeholder={{color:"gray.700"}} border="solid black 0.06rem" _focus={{backgroundColor: "#fff"}} bgColor={"gray.200"} onChange={handleFilterId} mr="2" />
          <Input placeholder="Filtrar por nome" value={filterName} _placeholder={{color:"gray.700"}} border="solid black 0.06rem" _focus={{backgroundColor: "#fff"}} bgColor={"gray.200"} onChange={handleFilterName} />
        </Flex>

        <Flex justify="center" bgColor="gray.100" w="20%" borderRadius="9999999px">
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
                fetchUsers();
              }}
            />
          </Flex>

          <Flex width="100%" h="100%" alignItems="center" ml="2" bgColor="gray.300" p="0 1rem" border="solid gray 0.05rem" borderRadius={"0.25rem"} justify={"center"}>
            <Text as={FormLabel} mt="0.5rem" htmlFor="inputAno" mr="1rem">Ano:</Text>
            <Input
              id="inputAno"
              type="number"
              placeholder="Ano"
              bgColor="#fff"
              border="solid 0.12rem black"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                fetchUsers();
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
            <Th>Fatura Total <Text fontSize="1.20rem" color="blue.500" fontWeight="600">{formatPrice(totalFatura)}</Text></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user:any, index:any) => (
            <Tr key={index}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{formatPrice(userTotalPrices[user.id] || 0)}</Td>
              <Td>
                <Button onClick={() => handleSelectUser(user.id)} bgColor="blue.400">Selecionar</Button>
              </Td>
              <Td>
								<Button onClick={() => handleModifyUser(user)} bgColor="orange.400"><Icon as={FaEdit} w="1rem" h="1rem"/></Button>
								<AlertDialog
									motionPreset='slideInBottom'
									leastDestructiveRef={cancelRef}
									onClose={handleCloseModifyModal}
									isOpen={isModifyModalOpen}
									isCentered
								>
									<AlertDialogOverlay />
									<AlertDialogContent>
										<AlertDialogHeader>Modificar Usuário</AlertDialogHeader>
										<AlertDialogCloseButton />
										<AlertDialogBody>
										<FormControl>
											<FormLabel>Nome</FormLabel>
											<Input 
												value={selectedUser.name ? selectedUser.name : '' } 
												onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Email</FormLabel>
											<Input 
												value={selectedUser.email ? selectedUser.email : '' } 
												onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Senha</FormLabel>
											<Input 
												value={selectedUser.password ? selectedUser.password : '' } 
												onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Limite de crédito</FormLabel>
											<Input 
												type="number"
												value={selectedUser.credit_limit ? selectedUser.credit_limit : '' } 
												onChange={(e) => setSelectedUser({ ...selectedUser, credit_limit: e.target.value })}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Função</FormLabel>
											<Select
												value={selectedUser.role ? selectedUser.role : '' } 
												onChange={(e:any) => setSelectedUser({ ...selectedUser, role: e.target.value })}
											>
												<option value="ADMIN">Administrador</option>
												<option value="MIDDLE">Cantina</option>
												<option value="MEMBER">Aluno</option>
											</Select>
										</FormControl>
										<FormControl>
											<FormLabel>Imagem</FormLabel>
											<Input type="file" onChange={handleImageChange} />
											{imagePreview && (
												<Box mt={2}>
													<Image src={imagePreview} alt="Preview" maxW="200px" maxH="200px" />
												</Box>
											)}
										</FormControl>

									</AlertDialogBody>

										<AlertDialogFooter>
											<Button ref={cancelRef} onClick={handleCloseModifyModal}>
												Cancelar
											</Button>
											<Button colorScheme='orange' ml={3} onClick={() => handleUpdateUser(selectedUser)}>
												Salvar
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

                <Button onClick={() => setSelectedUserId(user.id)} bgColor="red.400"><Icon as={FaTrash} w="1rem" size="1rem"/></Button>
                <AlertDialog
                  motionPreset='slideInBottom'
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                  isOpen={selectedUserId === user.id}
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
